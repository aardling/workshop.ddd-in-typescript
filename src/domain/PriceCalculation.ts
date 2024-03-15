import DroppedFraction, { AllowedFractionType } from "./droppedFraction";
import Price from "./price";

export interface PriceCalculator {
  calculate(droppedFraction: DroppedFraction): Price;
}

export type PriceKey = `${AllowedFractionType}_${string}`;
export function priceKey(
  city: string,
  fractionType: AllowedFractionType,
): PriceKey {
  return `${fractionType}_${city}`;
}

export interface PriceCalculators {
  add: (key: PriceKey, calculator: PriceCalculator) => void;
  find: (key: PriceKey) => PriceCalculator;
}

export class DefaultPriceCalculator implements PriceCalculator {
  readonly #pricePerKg: Price;
  constructor(pricePerKg: Price) {
    this.#pricePerKg = pricePerKg;
  }

  calculate(droppedFraction: DroppedFraction) {
    return this.#pricePerKg.times(droppedFraction.weight.amount);
  }
}
