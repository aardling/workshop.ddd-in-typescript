import DroppedFraction, {
  AllowedFractionType,
  FractionType,
} from "./droppedFraction";
import { ExternalVisitorType } from "./externalTypes";
import Price from "./price";
import Weight from "./weight";

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

export class PriceCalculatorWithExcemptions implements PriceCalculator {
  #weightLimit: number;
  #firstPriceCalculator: PriceCalculator;
  #secondPriceCalculator: PriceCalculator;
  #currentWeightDropped: number;

  constructor(
    weightLimit: number,
    firstPriceCalculator: PriceCalculator,
    secondPriceCalculator: PriceCalculator,
  ) {
    this.#weightLimit = weightLimit;
    this.#firstPriceCalculator = firstPriceCalculator;
    this.#secondPriceCalculator = secondPriceCalculator;
    this.#currentWeightDropped = 0;
  }

  calculate(droppedFraction: DroppedFraction) {
    const remaining = Math.max(
      0,
      this.#weightLimit - this.#currentWeightDropped,
    );
    const amountForFirst = Math.min(droppedFraction.weight.amount, remaining);
    const amountForSecond = Math.max(
      0,
      droppedFraction.weight.amount - amountForFirst,
    );
    const fractionType = FractionType.fromString(droppedFraction.type);
    const droppedForFirst = new DroppedFraction(
      fractionType,
      new Weight(amountForFirst),
    );
    const droppedForSecond = new DroppedFraction(
      fractionType,
      new Weight(amountForSecond),
    );

    const firstPrice = this.#firstPriceCalculator.calculate(droppedForFirst);
    const secondPrice = this.#secondPriceCalculator.calculate(droppedForSecond);
    this.#currentWeightDropped += droppedFraction.weight.amount;
    return firstPrice.add(secondPrice);
  }
}
