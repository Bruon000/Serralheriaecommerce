/**
 * Conversation state machine for gate sales chat.
 * Rule-based: no LLM. Decides next response from parsed input and context.
 */

import type { GateType } from "./parser";
import { calcularPortao, estimateGatePrice } from "./calculator";
import { normalizeChatText } from "./intent";

export type ChatState =
  | "idle"
  | "waiting_tipo"
  | "waiting_medidas"
  | "calculado"
  | "catalogo"
  | "foto_recebida"
  | "handoff_whatsapp";

export interface ChatContext {
  tipo?: string;
  largura?: number;
  altura?: number;
  area?: number;
  cidade?: string;
  foto?: string;
}

export type ParsedInput = {
  tipo: GateType | null;
  medidas: { largura: number; altura: number } | null;
  cidade: string | null;
  other: "other" | null;
};

export type EngineResponse = {
  nextState: ChatState;
  context: ChatContext;
  message: string;
  /** When calculado: show Ver modelos / Enviar foto / Falar no WhatsApp */
  showActionButtons?: boolean;
  /** When other service or user asks: show only WhatsApp handoff */
  showWhatsAppOnly?: boolean;
  /** Estimate to display (min, max) */
  estimate?: { min: number; max: number };
  /** When user asks for models: component should show catalog (fetch by context.tipo if set) */
  showCatalog?: boolean;
};

const INITIAL_MESSAGE =
  "Olá! Posso calcular seu portão ou mostrar alguns modelos.\n\nDigite o tipo e as medidas.\n\nExemplo:\nportão deslizante 3x2";

export function getInitialMessage(): string {
  return INITIAL_MESSAGE;
}

export function processInput(
  state: ChatState,
  context: ChatContext,
  parsed: ParsedInput,
  rawMessage: string
): EngineResponse {
  const text = normalizeChatText(rawMessage);

  console.log("[chat-intent]", text);

  // =========================
  // INTENÇÕES GLOBAIS
  // =========================

  if (
    text.includes("oi") ||
    text.includes("ola") ||
    text.includes("bom dia") ||
    text.includes("boa tarde") ||
    text.includes("boa noite")
  ) {
    return {
      nextState: state,
      context,
      message:
        "Olá! Posso ajudar a calcular seu portão, mostrar modelos ou te encaminhar para o WhatsApp.",
    };
  }

  if (
    text.includes("modelo") ||
    text.includes("modelos") ||
    text.includes("foto") ||
    text.includes("imagem")
  ) {
    if (context.tipo) {
      return {
        nextState: "catalogo",
        context,
        message: `Aqui estão alguns modelos de portão ${tipoLabel(context.tipo)}.`,
        showCatalog: true,
      };
    }

    return {
      nextState: "waiting_tipo",
      context,
      message: "Qual tipo de portão?\n\ndeslizante\nsocial\n2 folhas",
    };
  }

  if (
    text.includes("whatsapp") ||
    text.includes("atendente") ||
    text.includes("falar")
  ) {
    return {
      nextState: "handoff_whatsapp",
      context,
      message: "Vou te encaminhar para o serralheiro 👍",
      showWhatsAppOnly: true,
    };
  }

  if (text.includes("entrega") || text.includes("prazo")) {
    return {
      nextState: state,
      context,
      message:
        "Sim! Fazemos a entrega conforme disponibilidade da equipe. O prazo médio é de 7 a 15 dias úteis.",
    };
  }

  // --- Then handle parsed content (tipo, medidas, other) ---

  const { tipo, medidas, cidade, other } = parsed;

  if (other === "other") {
    return {
      nextState: "handoff_whatsapp",
      context: { ...context, cidade: cidade ?? context.cidade },
      message:
        "Também fazemos esse tipo de projeto 👍\n\nPara te atender melhor, vou encaminhar seu pedido para o serralheiro no WhatsApp.",
      showWhatsAppOnly: true,
    };
  }

  if (state === "waiting_medidas") {
    // se detectou medidas nesta mensagem
    if (parsed.medidas) {
      const { largura, altura } = parsed.medidas;
      const { area, min, max } = calcularPortao(largura, altura);
      const nextContext: ChatContext = { ...context, largura, altura, area };
      return {
        nextState: "calculado",
        context: nextContext,
        message: `Área: ${area.toFixed(2)} m²\n\nEstimativa inicial:\nR$${min.toFixed(0)} — R$${max.toFixed(0)}\n\nQuer ver alguns modelos desse tipo?`,
        showActionButtons: true,
        estimate: { min: Math.round(min), max: Math.round(max) },
      };
    }

    // se não detectou medidas e não houve outra intenção
    return {
      nextState: "waiting_medidas",
      context,
      message: "Pode me informar as medidas aproximadas? Exemplo: 3x2",
    };
  }

  const nextContext: ChatContext = { ...context };
  if (tipo) nextContext.tipo = tipo;
  if (medidas) {
    nextContext.largura = medidas.largura;
    nextContext.altura = medidas.altura;
    nextContext.area = medidas.largura * medidas.altura;
  }
  if (cidade) nextContext.cidade = cidade;

  const hasTipo = Boolean(nextContext.tipo);
  const hasMedidas =
    nextContext.largura != null &&
    nextContext.altura != null &&
    nextContext.area != null &&
    nextContext.area > 0;

  if (hasTipo && hasMedidas) {
    const { min, max } = estimateGatePrice(nextContext.area!);
    return {
      nextState: "calculado",
      context: nextContext,
      message: `Área: ${nextContext.area} m²\n\nEstimativa inicial:\nR$${min} — R$${max}\n\nQuer ver alguns modelos desse tipo?`,
      showActionButtons: true,
      estimate: { min, max },
    };
  }

  if (!hasTipo) {
    return {
      nextState: "waiting_tipo",
      context: nextContext,
      message: "Qual tipo de portão?\n\nExemplos:\ndeslizante\nsocial\n2 folhas",
    };
  }

  if (!hasMedidas) {
    const isFirstTimeTipo = Boolean(tipo);
    return {
      nextState: "waiting_medidas",
      context: nextContext,
      message: isFirstTimeTipo
        ? `Perfeito 👍 portão ${tipoLabel(nextContext.tipo!)}.\n\nAgora me diga as medidas (ex: 3x2).`
        : "Pode me informar as medidas aproximadas? Exemplo: 3x2",
    };
  }

  // Fallback when no rule matches
  return {
    nextState: state,
    context,
    message:
      "Posso:\n\n• calcular o valor do portão\n• mostrar alguns modelos\n• ou te encaminhar para o WhatsApp",
  };
}

function tipoLabel(tipo: string): string {
  if (tipo === "deslizante") return "deslizante";
  if (tipo === "social") return "social";
  if (tipo === "duas_folhas") return "2 folhas";
  return tipo;
}

/** After photo upload: acknowledge and ask for measures if missing. */
export function processPhotoReceived(context: ChatContext, photoUrl: string): EngineResponse {
  const nextContext: ChatContext = { ...context, foto: photoUrl };

  const hasMedidas =
    context.largura != null && context.altura != null && context.area != null && context.area > 0;

  if (hasMedidas) {
    const { min, max } = estimateGatePrice(context.area!);
    return {
      nextState: "calculado",
      context: nextContext,
      message: `Foto recebida 👍\n\nÁrea: ${context.area} m²\nEstimativa inicial:\nR$${min} — R$${max}\n\nQuer ver alguns modelos ou falar no WhatsApp?`,
      showActionButtons: true,
      estimate: { min, max },
    };
  }

  return {
    nextState: "foto_recebida",
    context: nextContext,
    message:
      "Foto recebida 👍\n\nVocê sabe aproximadamente a largura e altura do portão?\nExemplo: 3x2",
  };
}

/** Map internal gate type to API slug (metadata.tipo). */
export function tipoToApiSlug(tipo: string): string {
  if (tipo === "duas_folhas") return "2 folhas";
  return tipo;
}
