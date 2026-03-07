/**
 * Interpreta mensagem do cliente no chat: tipo de portão e medidas (largura x altura).
 */

export type ParsedMessage = {
  tipo?: string;
  largura?: number;
  altura?: number;
};

/** Detecta tipo de portão com sinônimos. Retorna "deslizante" | "social" | "2 folhas" | null. */
export function detectTipo(text: string): string | null {
  const t = text.toLowerCase().trim();
  if (t.includes("correr")) return "deslizante";
  if (t.includes("deslizante")) return "deslizante";
  if (t.includes("social")) return "social";
  if (t.includes("2 folhas")) return "2 folhas";
  if (t.includes("duas folhas")) return "2 folhas";
  return null;
}

/** Detecta medidas no texto: 3x2, 3 x 2, 3,00x2,10, 3 metros por 2. */
export function detectMedidas(text: string): { largura: number; altura: number } | null {
  /** 3x2, 3 x 2, 3,00x2,10 */
  let match = text.match(/(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)/);
  if (!match) {
    /** 3 metros por 2, 3m por 2 */
    match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:metros?|m)\s*por\s*(\d+(?:[.,]\d+)?)/i);
  }
  if (!match) return null;
  const largura = parseFloat(match[1].replace(",", "."));
  const altura = parseFloat(match[2].replace(",", "."));
  if (Number.isNaN(largura) || Number.isNaN(altura) || largura <= 0 || altura <= 0) return null;
  return { largura, altura };
}

function parseNumber(s: string): number {
  return parseFloat(s.replace(",", ".")) || 0;
}

const TIPO_PATTERNS: { pattern: RegExp | string; value: string }[] = [
  { pattern: /port[aã]o\s+de\s+correr|deslizante|correr/i, value: "Deslizante" },
  { pattern: /port[aã]o\s+social|social/i, value: "Social" },
  { pattern: /2\s*folhas|duas\s*folhas/i, value: "2 folhas" },
];

const MEASURES_REGEX = /(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)/;
const MEASURES_POR_REGEX = /(\d+(?:[.,]\d+)?)\s*(?:metros?|m)\s*por\s*(\d+(?:[.,]\d+)?)/i;

export function parseMessage(text: string): ParsedMessage {
  const result: ParsedMessage = {};
  const t = text.trim();

  const tipo = detectTipo(t);
  if (tipo) result.tipo = tipo === "deslizante" ? "Deslizante" : tipo === "social" ? "Social" : "2 folhas";

  const medidas = detectMedidas(t);
  if (medidas) {
    result.largura = medidas.largura;
    result.altura = medidas.altura;
  }

  return result;
}

/** Converte tipo para slug da API (getProductsByType). */
export function tipoToSlug(tipo: string): string {
  const lower = tipo.toLowerCase().trim();
  if (lower.includes("deslizante")) return "deslizante";
  if (lower.includes("social")) return "social";
  if (lower.includes("2 folhas")) return "2 folhas";
  return lower;
}
