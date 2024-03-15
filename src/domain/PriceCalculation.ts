import DroppedFraction, {
  AllowedFractionType,
  FractionType,
} from "./droppedFraction";
import { ExternalVisitor, ExternalVisitorType } from "./externalTypes";
import Price from "./price";
import { Visitor } from "./visitor";
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

export type PriceCalculatorFixedPriceDefinition = {
  pricePerKg: Price;
};

export type PriceCalculatorWithExcemtpionsDefinition = {
  weightLimit: number;
  firstCalculator: PriceCalculatorFixedPriceDefinition;
  secondCalculator: PriceCalculatorFixedPriceDefinition;
};

export type PriceCalculatorDefinition =
  | PriceCalculatorFixedPriceDefinition
  | PriceCalculatorWithExcemtpionsDefinition;

export interface PriceCalculators {
  add: (key: PriceKey, calculatorDefinition: PriceCalculatorDefinition) => void;
  get: (visitor: Visitor, fractionType: AllowedFractionType) => PriceCalculator;
  save: (priceCalculator: PriceCalculator) => void;
}

export class PriceCalculatorFixedPrice implements PriceCalculator {
  readonly #pricePerKg: Price;
  constructor(definition: PriceCalculatorFixedPriceDefinition) {
    this.#pricePerKg = definition.pricePerKg;
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

  constructor(definition: PriceCalculatorWithExcemtpionsDefinition) {
    this.#weightLimit = definition.weightLimit;
    this.#firstPriceCalculator = new PriceCalculatorFixedPrice(
      definition.firstCalculator,
    );
    this.#secondPriceCalculator = new PriceCalculatorFixedPrice(
      definition.secondCalculator,
    );
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
