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
    <div className="fixed right-6 bottom-28 z-[80]">
      {expanded && (
        <div
          className="
            mb-3
            w-[260px]
            bg-zinc-900
            text-white
            p-4
            rounded-xl
            shadow-xl
            border border-zinc-700
          "
        >
          <p className="text-sm font-semibold">👷 Ofertas para construtores</p>

          <p className="text-xs text-zinc-400 mt-1">
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
              rounded
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
