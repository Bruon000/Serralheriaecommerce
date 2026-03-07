/**
 * Motor do chat de pré-orçamento de portões.
 * Regra principal: sempre detectar intenção primeiro. Estado não bloqueia novas perguntas.
 */

import type { GateType } from "./parser";
import { parseGateType, parseMeasurements, tipoLabel } from "./parser";
import { estimateGatePrice, calcularPortao } from "./calculator";

export type ChatContext = {
  tipo?: string;
  largura?: number;
  altura?: number;
  area?: number;
  foto?: string;
};

export type Intent =
  | "calcular"
  | "modelos"
  | "instagram"
  | "whatsapp"
  | "entrega"
  | "foto"
  | "medidas"
  | "tipo"
  | "desconhecido";

export type ChatResponse = {
  message: string;
  context: ChatContext;
  showCatalog?: boolean;
  showWhatsAppOnly?: boolean;
  showInstagram?: boolean;
  showActionButtons?: boolean;
  estimate?: { min: number; max: number };
};

/** Detecta intenção do usuário a partir de palavras-chave. Sempre executar primeiro. */
export function detectIntent(mensagem: string): Intent {
  const t = mensagem.toLowerCase().trim();

  if (
    t.includes("modelo") ||
    t.includes("modelos") ||
    t.includes("imagem") ||
    t.includes("imagens") ||
    t.includes("foto") ||
    t.includes("fotos") ||
    t.includes("exemplo")
  ) {
    return "modelos";
  }
  if (t.includes("instagram") || t.includes("insta")) return "instagram";
  if (
    t.includes("whatsapp") ||
    t.includes("falar") ||
    t.includes("atendente") ||
    t.includes("contato")
  ) {
    return "whatsapp";
  }
  if (t.includes("entrega") || t.includes("prazo")) return "entrega";

  return "desconhecido";
}

const INITIAL_MESSAGE =
  "Olá! Posso calcular seu portão ou mostrar alguns modelos.\n\nDigite o tipo e as medidas.\n\nExemplo:\nportão deslizante 3x2";

export function getInitialMessage(): string {
  return INITIAL_MESSAGE;
}

/**
 * Processa a mensagem do usuário e retorna a resposta do bot.
 * Intenção sempre tem prioridade; em seguida usa contexto (tipo, medidas).
 */
export function processMessage(
  mensagem: string,
  context: ChatContext
): ChatResponse {
  const text = mensagem.trim();
  const intent = detectIntent(text);
  const parsedTipo = parseGateType(text);
  const parsedMedidas = parseMeasurements(text);

  const nextContext: ChatContext = { ...context };
  if (parsedTipo) nextContext.tipo = parsedTipo;
  if (parsedMedidas) {
    nextContext.largura = parsedMedidas.largura;
    nextContext.altura = parsedMedidas.altura;
    nextContext.area = parsedMedidas.largura * parsedMedidas.altura;
  }

  const textLower = text.toLowerCase();

  // --- Modelo/imagem/foto → mostrar Instagram ---
  if (
    textLower.includes("modelo") ||
    textLower.includes("imagem") ||
    textLower.includes("foto")
  ) {
    return {
      message: "Veja alguns modelos que já fabricamos 👇",
      context: nextContext,
      showInstagram: true,
    };
  }

  // --- WhatsApp/falar/atendente → encaminhar ---
  if (
    textLower.includes("whatsapp") ||
    textLower.includes("falar") ||
    textLower.includes("atendente")
  ) {
    return {
      message: "Vou te encaminhar para o serralheiro 👍",
      context: nextContext,
      showWhatsAppOnly: true,
    };
  }

  // --- Medidas parseadas → calcular e mostrar estimativa ---
  if (parsedMedidas) {
    const result = calcularPortao(parsedMedidas.largura, parsedMedidas.altura);
    return {
      message: `Área: ${result.area} m²\n\nEstimativa inicial:\nR$${Math.round(result.min)} — R$${Math.round(result.max)}`,
      context: nextContext,
      showActionButtons: true,
      estimate: { min: Math.round(result.min), max: Math.round(result.max) },
    };
  }

  // --- Intenções globais (sempre respondidas, independente do estado) ---

  if (intent === "modelos") {
    if (nextContext.tipo) {
      return {
        message: `Aqui estão alguns modelos de portão ${tipoLabel(nextContext.tipo)}.`,
        context: nextContext,
        showCatalog: true,
      };
    }
    return {
      message: "Qual tipo de portão?\n\ndeslizante\nsocial\n2 folhas",
      context: nextContext,
    };
  }

  if (intent === "instagram") {
    return {
      message:
        "Você pode ver alguns modelos que já fabricamos no nosso Instagram 👇",
      context: nextContext,
      showInstagram: true,
    };
  }

  if (intent === "whatsapp") {
    return {
      message: "Vou te encaminhar para o serralheiro 👍",
      context: nextContext,
      showWhatsAppOnly: true,
    };
  }

  if (intent === "entrega") {
    return {
      message:
        "Sim! Fazemos a entrega conforme disponibilidade da equipe.\n\nPrazo médio: 7 a 15 dias úteis.",
      context: nextContext,
    };
  }

  // --- Calcular: temos tipo e medidas (parsed ou no contexto) ---

  const hasTipo = Boolean(nextContext.tipo);
  const hasMedidas =
    nextContext.largura != null &&
    nextContext.altura != null &&
    nextContext.area != null &&
    nextContext.area > 0;

  if (hasTipo && hasMedidas) {
    const { min, max } = estimateGatePrice(nextContext.area!);
    return {
      message: `Área: ${nextContext.area} m²\n\nEstimativa inicial:\nR$${min} — R$${max}\n\nQuer ver alguns modelos desse tipo?`,
      context: nextContext,
      showActionButtons: true,
      estimate: { min, max },
    };
  }

  // --- Só tipo informado (agora ou antes): pedir medidas ---

  if (hasTipo) {
    const isFirstTimeTipo = Boolean(parsedTipo);
    return {
      message: isFirstTimeTipo
        ? `Perfeito 👍 portão ${tipoLabel(nextContext.tipo!)}.\n\nAgora me diga as medidas (ex: 3x2).`
        : "Pode me informar as medidas aproximadas? Exemplo: 3x2",
      context: nextContext,
    };
  }

  // --- Só medidas informadas: pedir tipo ---

  if (hasMedidas) {
    return {
      message: "Qual tipo de portão?\n\ndeslizante\nsocial\n2 folhas",
      context: nextContext,
    };
  }

  // --- Nada identificado: fallback ---

  return {
    message:
      "Posso:\n\n• calcular o valor do portão\n• mostrar alguns modelos\n• ou te encaminhar para o WhatsApp",
    context: nextContext,
  };
}

/** Resposta ao receber foto (upload). */
export function processPhotoReceived(
  context: ChatContext,
  photoUrl: string
): ChatResponse {
  const nextContext: ChatContext = { ...context, foto: photoUrl };
  return {
    message:
      "Foto recebida 👍\n\nIsso ajuda a preparar um orçamento mais preciso.",
    context: nextContext,
  };
}

export { tipoToApiSlug } from "./parser";
