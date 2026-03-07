"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

/** Botão flutuante Área Construtor: sempre visível, canto inferior direito, sem emoji. */
export default function FloatingConstrutor() {
  return (
    <Link
      href="/construtor"
      aria-label="Área Construtor"
      title="Área Construtor — Condições especiais para profissionais"
      className={[
        "fixed right-6 bottom-44 z-[75]",
        "inline-flex items-center justify-center gap-2 h-14 min-w-[56px] rounded-full overflow-hidden",
        "bg-primary text-primary-foreground",
        "ring-1 ring-white/15",
        "shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        "hover:brightness-110 hover:scale-[1.04] active:scale-[0.98] transition-transform duration-200",
        "px-4 sm:px-5",
      ].join(" ")}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/15 text-primary-foreground">
        <Building2 className="h-5 w-5" />
      </span>
      <span className="hidden sm:inline text-sm font-extrabold whitespace-nowrap">Área Construtor</span>
    </Link>
  );
}
