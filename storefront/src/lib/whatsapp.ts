export function normalizeWhatsappNumber(raw?: string) {
  return (raw ?? "").replace(/\D/g, "");
}

export function getWhatsappNumber(opts?: { b2b?: boolean }) {
  const varejo = normalizeWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const b2b = normalizeWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_B2B);

  if (opts?.b2b && b2b) return b2b;
  if (varejo) return varejo;

  // fallback explícito (evita quebrar o link)
  return "55";
}

export function buildWhatsappLink(message: string, opts?: { b2b?: boolean }) {
  const number = getWhatsappNumber(opts);
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${number}?text=${text}`;
}
