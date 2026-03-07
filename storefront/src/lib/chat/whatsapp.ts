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

function tipoLabel(tipo: string): string {
  if (tipo === "deslizante") return "portão deslizante";
  if (tipo === "social") return "portão social";
  if (tipo === "duas_folhas") return "portão 2 folhas";
  return tipo;
}

/**
 * Build the text message sent to WhatsApp.
 * If baseUrl is provided, photo URL is absolute; otherwise relative.
 */
export function buildWhatsappMessage(context: WhatsAppContext, baseUrl?: string): string {
  const lines: string[] = [
    "Olá!",
    "",
    "Quero orçamento.",
    "",
    context.tipo ? `Tipo: ${tipoLabel(context.tipo)}` : "",
    context.largura != null ? `Largura: ${context.largura}m` : "",
    context.altura != null ? `Altura: ${context.altura}m` : "",
    context.area != null ? `Área: ${context.area}m²` : "",
    context.min != null && context.max != null
      ? `Estimativa do site: R$${context.min} — R$${context.max}`
      : "",
  ].filter(Boolean);

  if (context.foto) {
    const photoUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}${context.foto}` : context.foto;
    lines.push("", "Modelo enviado:", photoUrl);
  }

  if (context.cidade) {
    lines.push("", `Cidade: ${context.cidade}`);
  }

  return lines.join("\n");
}

export function getWhatsAppLink(context: WhatsAppContext, baseUrl?: string): string {
  const text = buildWhatsappMessage(context, baseUrl);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
