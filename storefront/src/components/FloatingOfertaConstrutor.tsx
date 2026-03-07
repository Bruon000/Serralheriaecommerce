"use client";

import { useEffect, useState } from "react";

export default function FloatingOfertaConstrutor() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      setExpanded(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed right-4 bottom-48 z-[78] sm:right-6 sm:bottom-52">
      {expanded && (
        <div
          className="
            mb-3
            w-[210px] sm:w-[240px]
            bg-zinc-900/95
            text-white
            p-3.5
            rounded-2xl
            shadow-[0_16px_40px_rgba(0,0,0,0.45)]
            border border-zinc-700/90
            backdrop-blur
          "
        >
          <p className="text-sm font-semibold">👷 Ofertas para construtores</p>

          <p className="text-xs leading-5 text-zinc-400 mt-1">
            Temos condições especiais para obras e construtores.
          </p>

          <a
            href="/ofertas"
            className="
              block
              mt-3
              bg-yellow-500
              text-black
              text-center
              py-2
              rounded-lg
              font-semibold
            "
          >
            Ver ofertas
          </a>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="
          bg-yellow-500
          text-black
          rounded-full
          px-4
          py-3
          shadow-lg
          font-semibold
          hover:scale-105
          transition
        "
      >
        🔥 Ofertas
      </button>
    </div>
  );
}
