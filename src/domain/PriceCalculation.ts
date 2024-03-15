import DroppedFraction, { AllowedFractionType } from "./droppedFraction";
import Price from "./price";

interface PriceCalculator {
  calculate(droppedFraction: DroppedFraction): Price;
}

type PriceKey = `${AllowedFractionType}_${string}`;

export class PriceQuery {
  readonly #city: string;
  readonly #fractionType: AllowedFractionType;

  constructor(city: string, fractionType: AllowedFractionType) {
    this.#city = city;
    this.#fractionType = fractionType;
  }

  toKey(): PriceKey {
    return `${this.#fractionType}_${this.#city}`;
  }
}

export class Prices {
  readonly #prices: { [key: PriceKey]: PriceCalculator } = {};

  constructor() {}

  add(key: PriceKey, calculator: PriceCalculator) {
    this.#prices[key] = calculator;
  }

  find(query: PriceQuery): PriceCalculator {
    return this.#prices[query.toKey()];
  }
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
