"use client";

import React from "react";

type Props = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
};

export default function NumberStepper({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  className = "",
}: Props) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const inc = () => onChange(clamp(value + step));
  const dec = () => onChange(clamp(value - step));

  return (
    <div className={`flex items-center gap-1 ${className}`.trim()}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="h-9 w-9 shrink-0 rounded-lg border border-border/50 bg-black/35 text-lg font-bold text-foreground hover:bg-black/50 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Diminuir"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className="h-9 w-full min-w-0 rounded-xl border border-border/50 bg-black/35 px-2 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="h-9 w-9 shrink-0 rounded-lg border border-border/50 bg-black/35 text-lg font-bold text-foreground hover:bg-black/50 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  );
}
