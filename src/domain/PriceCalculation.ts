import DroppedFraction, { AllowedFractionType } from "./droppedFraction";
import { ExternalVisitorType } from "./externalTypes";
import Price from "./price";

export interface PriceCalculator {
  calculate(droppedFraction: DroppedFraction): Price;
}

export type PriceKey =
  `${AllowedFractionType}_${ExternalVisitorType}_${string}`;
export function priceKey(
  city: string,
  vistorType: ExternalVisitorType,
  fractionType: AllowedFractionType,
): PriceKey {
  return `${fractionType}_${vistorType}_${city}`;
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
