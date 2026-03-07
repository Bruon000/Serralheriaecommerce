/**
 * Price calculator for gate estimates.
 * Rule-based: min = area * 180, max = area * 260.
 */

const PRICE_MIN_PER_M2 = 180;
const PRICE_MAX_PER_M2 = 260;

export type GateEstimate = {
  min: number;
  max: number;
};

export function estimateGatePrice(area: number): GateEstimate {
  if (area <= 0) return { min: 0, max: 0 };
  return {
    min: Math.round(area * PRICE_MIN_PER_M2),
    max: Math.round(area * PRICE_MAX_PER_M2),
  };
}

export function calcularPortao(largura: number, altura: number) {
  const area = largura * altura;
  const min = area * PRICE_MIN_PER_M2;
  const max = area * PRICE_MAX_PER_M2;
  return {
    area,
    min,
    max,
  };
}
