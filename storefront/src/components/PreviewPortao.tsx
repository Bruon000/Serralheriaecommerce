"use client";

type PreviewPortaoProps = {
  tipo: string;
  largura: string;
  altura: string;
};

export default function PreviewPortao({ tipo, largura, altura }: PreviewPortaoProps) {
  const w = Number(largura) || 2;
  const h = Number(altura) || 1;
  // Proporção visual: manter aspecto largura x altura (portão deitado)
  const maxSize = 200;
  const scale = Math.min(maxSize / Math.max(w, 1), maxSize / Math.max(h, 1));
  const rectW = Math.round(w * scale);
  const rectH = Math.round(h * scale);

  return (
    <div className="w-full max-w-[240px] mx-auto my-2">
      <svg
        width="100%"
        height="120"
        viewBox="0 0 220 120"
        className="text-white"
        aria-hidden
      >
        {/* Largura no topo */}
        <text x="110" y="18" textAnchor="middle" className="fill-current text-[10px] font-medium">
          {largura || "—"} m
        </text>
        {/* Retângulo do portão (centralizado no viewBox) */}
        <rect
          x={(220 - rectW) / 2}
          y={30}
          width={rectW}
          height={rectH}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          rx="2"
        />
        {/* Altura na lateral esquerda */}
        <text x="16" y={30 + rectH / 2} textAnchor="middle" className="fill-current text-[9px] font-medium" transform={`rotate(-90, 16, ${30 + rectH / 2})`}>
          {altura || "—"} m
        </text>
      </svg>
    </div>
  );
}
