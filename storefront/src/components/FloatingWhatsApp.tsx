"use client";

/** Botão flutuante WhatsApp: 56x56, só ícone, posição que evita overlay do Next em dev. */
export default function FloatingWhatsApp() {
  const WA_NUMBER = "5584987940211";
  const msg = encodeURIComponent("Olá! Quero um orçamento grátis. Pode me ajudar?");
  const href = `https://wa.me/${WA_NUMBER}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp - Orçamento grátis"
      className={[
        "fixed z-[85]",
        "right-4 bottom-32 sm:right-6 sm:bottom-36",
        "inline-flex items-center justify-center h-[52px] w-[52px] rounded-full overflow-hidden",
        "bg-[#25D366]",
        "ring-2 ring-white/20",
        "shadow-[0_4px_14px_rgba(37,211,102,0.4),0_8px_24px_rgba(0,0,0,0.25)]",
        "hover:brightness-110 hover:scale-105 active:scale-[0.98] transition-all duration-200",
        "wa-pulse-10s",
      ].join(" ")}
    >
      {/* Logo oficial WhatsApp: balão + símbolo (telefone e traços) em branco */}
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="shrink-0">
        <path
          fill="#ffffff"
          d="M16.02 3C8.85 3 3.02 8.83 3.02 16c0 2.28.6 4.5 1.74 6.46L3 29l6.72-1.76A12.9 12.9 0 0 0 16.02 29c7.17 0 13-5.83 13-13S23.19 3 16.02 3zm0 23.6c-2.02 0-4-.54-5.72-1.56l-.41-.24-3.99 1.05 1.07-3.89-.27-.4a10.62 10.62 0 0 1-1.68-5.74c0-5.87 4.77-10.64 10.64-10.64S26.66 9.93 26.66 15.8 21.89 26.6 16.02 26.6z"
        />
        <path
          fill="#ffffff"
          d="M19.11 17.34c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.35-.82-.73-1.38-1.63-1.54-1.9-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47-.16-.01-.34-.01-.52-.01s-.48.07-.73.34c-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"
        />
      </svg>
    </a>
  );
}
