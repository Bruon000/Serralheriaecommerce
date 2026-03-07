import { calcularPortao } from "@/lib/chat/calculator";

export type GateType = "tubular" | "chapa" | "liso";

export type GateModel = "correr" | "abrir" | "basculante";

export function calculateGateEstimate(
  type: GateType,
  width: number,
  height: number
) {
  const { area, min, max } = calcularPortao(width, height);

  return {
    area: Number(area.toFixed(2)),
    min: Math.round(min),
    max: Math.round(max),
  };
}

