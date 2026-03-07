export function detectIntent(text: string) {
  const t = text.toLowerCase();

  if (
    t.includes("modelo") ||
    t.includes("imagem") ||
    t.includes("foto")
  ) {
    return "modelos";
  }

  if (t.includes("instagram") || t.includes("insta")) {
    return "instagram";
  }

  if (
    t.includes("whatsapp") ||
    t.includes("atendente") ||
    t.includes("falar")
  ) {
    return "whatsapp";
  }

  if (t.includes("entrega") || t.includes("prazo")) {
    return "entrega";
  }

  if (
    t.includes("valor") ||
    t.includes("preço") ||
    t.includes("preco") ||
    t.includes("quanto custa")
  ) {
    return "preco";
  }

  return "normal";
}
