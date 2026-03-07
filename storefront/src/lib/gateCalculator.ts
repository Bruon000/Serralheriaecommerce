export type GateType = "tubular" | "chapa" | "liso";

export type GateModel = "correr" | "abrir" | "basculante";

const PRICE_TABLE: Record<GateType, number> = {
  tubular: 220,
  chapa: 260,
  liso: 300,
};

export function calculateGateEstimate(
  type: GateType,
  width: number,
  height: number
) {
  const area = width * height;

  const basePrice = PRICE_TABLE[type] ?? PRICE_TABLE.tubular;

  const value = area * basePrice;

  return {
    area,
    min: Math.round(value * 0.9),
    max: Math.round(value * 1.2),
  };
}

