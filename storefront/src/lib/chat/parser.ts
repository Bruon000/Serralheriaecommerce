/**
 * Parser para o chat de pré-orçamento de portões.
 * Extrai tipo de portão e medidas da mensagem do usuário.
 */

export type GateType = "deslizante" | "social" | "duas_folhas";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Sinônimos que mapeiam para deslizante: correr, portão de correr, portao de correr */
export function parseGateType(text: string): GateType | null {
  const t = normalizeText(text);
  if (t.includes("correr") || t.includes("portao de correr")) {
    return "deslizante";
  }
  if (t.includes("deslizante")) return "deslizante";
  if (t.includes("social")) return "social";
  if (
    t.includes("2 folhas") ||
    t.includes("duas folhas") ||
    t.includes("duasfolhas")
  ) {
    return "duas_folhas";
  }
  return null;
}

export type Measurements = { largura: number; altura: number };

/**
 * Aceita formatos: 3x2, 3 x 2, 3,0x2, 3.5x2
 * Regex: (\d+[.,]?\d*)\s*x\s*(\d+[.,]?\d*)
 * Converte vírgula para ponto.
 */
export function parseMeasurements(text: string): Measurements | null {
  const normalized = normalizeText(text)
    .replace(/\bpor\b/g, "x")
    .replace(/\s+/g, " ");

  const match = normalized.match(/(\d+[.,]?\d*)\s*x\s*(\d+[.,]?\d*)/i);
  if (!match) return null;
  const largura = parseFloat(match[1].replace(",", "."));
  const altura = parseFloat(match[2].replace(",", "."));
  if (Number.isNaN(largura) || Number.isNaN(altura) || largura <= 0 || altura <= 0) {
    return null;
  }
  return { largura, altura };
}

/** Alias para parseMeasurements. */
export const parseMedidas = parseMeasurements;

/** Converte tipo interno para slug da API (metadata.tipo). */
export function tipoToApiSlug(tipo: string): string {
  if (tipo === "duas_folhas") return "2 folhas";
  return tipo;
}

/** Label amigável do tipo para exibição. */
export function tipoLabel(tipo: string): string {
  if (tipo === "deslizante") return "deslizante";
  if (tipo === "social") return "social";
  if (tipo === "duas_folhas") return "2 folhas";
  return tipo;
}
