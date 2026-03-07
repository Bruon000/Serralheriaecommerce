"use client";

export default function FloatingCart() {
  return (
    <a
      href="/carrinho"
      aria-label="Abrir carrinho"
      className={[
        "fixed bottom-5 right-5 z-[60]",
        "inline-flex items-center gap-2 rounded-full",
        "bg-[#F59E0B] px-4 py-3 text-black",
        "shadow-[0_10px_26px_rgba(0,0,0,0.35)]",
        "hover:brightness-110",
        "sm:bottom-6 sm:right-6",
      ].join(" ")}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-black/10 text-black text-lg font-black">
        🛒
      </span>
      <span className="text-sm font-extrabold">Carrinho</span>
    </a>
  );
}
