/**
 * Motor do chat de pré-orçamento de portões.
 * Regra principal: sempre detectar intenção primeiro. Estado não bloqueia novas perguntas.
 */

import { parseGateType, parseMeasurements, tipoLabel } from "./parser";
import { estimateGatePrice, calcularPortao } from "./calculator";
import {
  detectGreetingLabel,
  detectIntent,
  normalizeChatText,
  type Intent,
} from "./intent";

export type ChatContext = {
  tipo?: string;
  largura?: number;
  altura?: number;
  area?: number;
  foto?: string;
  fallbackCount?: number;
  lastIntent?: Intent;
};

export type ChatResponse = {
  message: string;
  context: ChatContext;
  showCatalog?: boolean;
  showWhatsAppOnly?: boolean;
  showInstagram?: boolean;
  showActionButtons?: boolean;
  estimate?: { min: number; max: number };
};

const INITIAL_MESSAGE =
  "Olá! Eu sou o Chat Delima 👋\n\nPosso te ajudar a:\n• calcular uma estimativa do seu portão\n• mostrar alguns modelos\n• encaminhar seu atendimento para o WhatsApp\n\nSe quiser começar agora, me envie o tipo e as medidas.\n\nExemplo:\nportão deslizante 3x2";

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
  const normalizedText = normalizeChatText(text);
  const intent = detectIntent(text);
  const greetingLabel = detectGreetingLabel(text);
  const parsedTipo = parseGateType(normalizedText);
  const parsedMedidas = parseMeasurements(normalizedText);

  const nextContext: ChatContext = {
    ...context,
    lastIntent: intent,
  };
  if (parsedTipo) nextContext.tipo = parsedTipo;
  if (parsedMedidas) {
    nextContext.largura = parsedMedidas.largura;
    nextContext.altura = parsedMedidas.altura;
    nextContext.area = parsedMedidas.largura * parsedMedidas.altura;
  }

  if (intent === "saudacao") {
    const saudacao =
      greetingLabel === "bom dia"
        ? "Bom dia!"
        : greetingLabel === "boa tarde"
          ? "Boa tarde!"
          : greetingLabel === "boa noite"
            ? "Boa noite!"
            : "Olá!";

    return {
      message:
        `${saudacao} Eu sou o Chat Delima.\n\nPosso ajudar a calcular seu portão, mostrar alguns modelos ou te encaminhar para o WhatsApp.\n\nSe quiser, me envie algo como: deslizante 3x2`,
      context: nextContext,
    };
  }

  if (intent === "modelos") {
    if (nextContext.tipo) {
      nextContext.fallbackCount = 0;
      return {
        message: `Aqui estão alguns modelos de portão ${tipoLabel(nextContext.tipo)} 👇`,
        context: nextContext,
        showCatalog: true,
        showInstagram: true,
        showActionButtons: true,
      };
    }

    return {
      message: "Você pode ver alguns modelos aqui 👇",
      context: nextContext,
      showInstagram: true,
      showActionButtons: true,
    };
  }

  if (intent === "instagram") {
    return {
      message: "Você pode ver alguns modelos que já fabricamos no Instagram 👇",
      context: nextContext,
      showActionButtons: true,
      showInstagram: true,
    };
  }

  if (intent === "whatsapp") {
    nextContext.fallbackCount = 0;
    return {
      message: "Vou te encaminhar para o serralheiro 👍",
      context: nextContext,
      showWhatsAppOnly: true,
    };
  }

  if (intent === "entrega") {
    nextContext.fallbackCount = 0;
    return {
      message:
        "Sim! Fazemos a entrega conforme disponibilidade da equipe.\n\nPrazo médio: 7 a 15 dias úteis.",
      context: nextContext,
    };
  }

  if (parsedMedidas) {
    const result = calcularPortao(parsedMedidas.largura, parsedMedidas.altura);
    nextContext.fallbackCount = 0;
    return {
      message: `Área: ${result.area} m²\n\nEstimativa inicial:\nR$${Math.round(result.min)} — R$${Math.round(result.max)}\n\nEsse valor é uma estimativa. O orçamento final segue no WhatsApp.`,
      context: nextContext,
      showActionButtons: true,
      estimate: { min: Math.round(result.min), max: Math.round(result.max) },
    };
  }

  if (intent === "desconhecido") {
    const fallbackCount = (context.fallbackCount ?? 0) + 1;
    nextContext.fallbackCount = fallbackCount;

    if (fallbackCount >= 2) {
      return {
        message:
          "Posso te ajudar de forma rápida 👇\n\n• digite 3x2 para calcular\n• peça modelos para ver referências\n• ou fale direto no WhatsApp",
        context: nextContext,
        showActionButtons: true,
        showWhatsAppOnly: true,
        showInstagram: true,
      };
    }

    return {
      message:
        "Não entendi muito bem, mas posso ajudar.\n\nVocê pode:\n• mandar as medidas (ex: 3x2)\n• pedir modelos\n• ou falar com o serralheiro no WhatsApp",
      context: nextContext,
    };
  }

  const hasTipo = Boolean(nextContext.tipo);
  const hasMedidas =
    nextContext.largura != null &&
    nextContext.altura != null &&
    nextContext.area != null &&
    nextContext.area > 0;

  if (hasTipo && hasMedidas) {
    const { min, max } = estimateGatePrice(nextContext.area!);
    nextContext.fallbackCount = 0;
    return {
      message: `Área: ${nextContext.area} m²\n\nEstimativa inicial:\nR$${min} — R$${max}\n\nEsse valor é uma estimativa. Quer ver alguns modelos desse tipo?`,
      context: nextContext,
      showActionButtons: true,
      estimate: { min, max },
    };
  }

  if (hasTipo) {
    const isFirstTimeTipo = Boolean(parsedTipo);
    nextContext.fallbackCount = 0;
    return {
      message: isFirstTimeTipo
        ? `Perfeito 👍 portão ${tipoLabel(nextContext.tipo!)}.\n\nAgora me diga as medidas (ex: 3x2).`
        : "Pode me informar as medidas aproximadas? Exemplo: 3x2",
      context: nextContext,
    };
  }

  if (hasMedidas) {
    nextContext.fallbackCount = 0;
    return {
      message: "Qual tipo de portão?\n\ndeslizante\nsocial\n2 folhas",
      context: nextContext,
    };
  }
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
