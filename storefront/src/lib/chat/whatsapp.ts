/**
 * WhatsApp message builder for handoff from chat.
 */

export type WhatsAppContext = {
  tipo?: string;
  largura?: number;
  altura?: number;
  area?: number;
  cidade?: string;
  foto?: string;
  /** Estimate to include in message */
  min?: number;
  max?: number;
};

const WA_NUMBER = "5584987940211";
const LEAD_SOURCE = "Lead vindo do chat do site";

function tipoLabel(tipo: string): string {
  if (tipo === "deslizante") return "portão deslizante";
  if (tipo === "social") return "portão social";
  if (tipo === "duas_folhas") return "portão 2 folhas";
  return tipo;
}

function formatArea(area?: number): string | null {
  if (area == null) return null;
  return Number.isInteger(area) ? `${area}m²` : `${area.toFixed(2)}m²`;
}

function formatMoney(value?: number): string | null {
  if (value == null) return null;
  return `R$${Math.round(value)}`;
}

/**
 * Build the text message sent to WhatsApp.
 * If baseUrl is provided, photo URL is absolute; otherwise relative.
 */
export function buildWhatsappMessage(context: WhatsAppContext, baseUrl?: string): string {
  const missingFields: string[] = [];
  if (!context.tipo) missingFields.push("tipo do portão");
  if (context.largura == null) missingFields.push("largura");
  if (context.altura == null) missingFields.push("altura");

  const lines: string[] = [
    "Olá!",
    "",
    "Quero um orçamento para portão/estrutura metálica.",
    "",
    LEAD_SOURCE,
    "",
    "Dados informados no site:",
    context.tipo ? `• Tipo: ${tipoLabel(context.tipo)}` : "",
    context.largura != null ? `• Largura: ${context.largura}m` : "",
    context.altura != null ? `• Altura: ${context.altura}m` : "",
    context.area != null ? `• Área aproximada: ${formatArea(context.area)}` : "",
    context.min != null && context.max != null
      ? `• Estimativa inicial do site: ${formatMoney(context.min)} — ${formatMoney(context.max)}`
      : "",
  ].filter(Boolean);

  if (context.foto) {
    const photoUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}${context.foto}` : context.foto;
    lines.push("", "Foto/local enviado pelo cliente:", photoUrl);
  }

  if (context.cidade) {
    lines.push("", `Cidade: ${context.cidade}`);
  }

  if (missingFields.length > 0) {
    lines.push(
      "",
      `Ainda preciso confirmar: ${missingFields.join(", ")}.`
    );
  }

  lines.push(
    "",
    "Observação: sei que a estimativa do site é inicial e que o valor final depende da avaliação do serralheiro.",
    "",
    "Pode me passar o orçamento final e os próximos passos?"
  );

  return lines.join("\n");
}

export function getWhatsAppLink(context: WhatsAppContext, baseUrl?: string): string {
  const text = buildWhatsappMessage(context, baseUrl);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
