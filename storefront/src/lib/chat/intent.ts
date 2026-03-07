export type Intent =
  | "saudacao"
  | "modelos"
  | "instagram"
  | "whatsapp"
  | "entrega"
  | "preco"
  | "medidas"
  | "tipo"
  | "desconhecido";

const TYPO_MAP: Record<string, string> = {
  wahats: "whatsapp",
  whats: "whatsapp",
  wats: "whatsapp",
  watzap: "whatsapp",
  zap: "whatsapp",
  wpp: "whatsapp",
  caucular: "calcular",
  calcualr: "calcular",
  calcularr: "calcular",
  imajem: "imagem",
  imagen: "imagem",
  froto: "foto",
  modleo: "modelo",
  instagran: "instagram",
};

function normalizeWord(word: string): string {
  return TYPO_MAP[word] ?? word;
}

export function normalizeChatText(text: string): string {
  const cleaned = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.,x]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .map(normalizeWord)
    .join(" ");
}

const GREETINGS = [
  "oi",
  "ola",
  "bom dia",
  "boa tarde",
  "boa noite",
  "e ai",
  "opa",
];

const GATE_TYPES = [
  "deslizante",
  "social",
  "2 folhas",
  "duas folhas",
  "duasfolhas",
  "correr",
  "portao de correr",
];

export function detectGreetingLabel(text: string): "bom dia" | "boa tarde" | "boa noite" | "ola" {
  const t = normalizeChatText(text);
  if (t.includes("bom dia")) return "bom dia";
  if (t.includes("boa tarde")) return "boa tarde";
  if (t.includes("boa noite")) return "boa noite";
  return "ola";
}

export function detectIntent(text: string): Intent {
  const t = normalizeChatText(text);

  if (GREETINGS.some((g) => t.includes(g))) {
    return "saudacao";
  }

  if (/(\d+[.,]?\d*)\s*(x|por)\s*(\d+[.,]?\d*)/i.test(t)) {
    return "medidas";
  }

  if (GATE_TYPES.some((g) => t.includes(g))) {
    return "tipo";
  }

  if (
    t.includes("modelo") ||
    t.includes("modelos") ||
    t.includes("mostra") ||
    t.includes("mostrar") ||
    t.includes("ver") ||
    t.includes("quero ver") ||
    t.includes("imagem") ||
    t.includes("imagens") ||
    t.includes("foto") ||
    t.includes("fotos") ||
    t.includes("catalogo") ||
    t.includes("catalogos") ||
    t.includes("exemplo") ||
    t.includes("tem usado") ||
    t.includes("tem modelo") ||
    t.includes("usado") ||
    t.includes("used")
  ) {
    return "modelos";
  }

  if (t.includes("instagram") || t.includes("insta")) {
    return "instagram";
  }

  if (
    t.includes("whatsapp") ||
    t.includes("atendente") ||
    t.includes("falar") ||
    t.includes("contato") ||
    t.includes("serralheiro")
  ) {
    return "whatsapp";
  }

  if (t.includes("entrega") || t.includes("prazo") || t.includes("instalacao")) {
    return "entrega";
  }

  if (
    t.includes("valor") ||
    t.includes("preco") ||
    t.includes("quanto custa") ||
    t.includes("orcamento") ||
    t.includes("calcular") ||
    t.includes("m2") ||
    t.includes("metro quadrado")
  ) {
    return "preco";
  }

  return "desconhecido";
}
