import {
  PriceCalculator,
  PriceCalculators,
  PriceKey,
} from "../domain/PriceCalculation";

export class InMemoryPriceCalculators implements PriceCalculators {
  readonly #prices: { [key: PriceKey]: PriceCalculator } = {};

  constructor() {}

  add(key: PriceKey, calculator: PriceCalculator) {
    this.#prices[key] = calculator;
  }

  find(key: PriceKey): PriceCalculator {
    return this.#prices[key];
  }
}
