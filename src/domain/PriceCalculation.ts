import DroppedFraction, {
  AllowedFractionType,
  FractionType,
} from "./droppedFraction";
import { ExternalVisitorType } from "./externalTypes";
import Price from "./price";
import { Visitor } from "./visitor";
import Weight from "./weight";

export interface PriceCalculator {
  calculate(droppedFraction: DroppedFraction): Price;
}

// FIXME
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

export type ComposedPriceCalculatorDefinition = {
  calculatorForConstruction: PriceCalculatorDefinition;
  calculatorForGreen: PriceCalculatorDefinition;
};

export type PriceCalculatorDefinition =
  | PriceCalculatorFixedPriceDefinition
  | PriceCalculatorWithExcemtpionsDefinition;

export class ComposedPriceCalculator {
  #construction: PriceCalculator;
  #green: PriceCalculator;

  constructor(definition: ComposedPriceCalculatorDefinition) {
    this.#construction = this.newPriceCalculator(
      definition.calculatorForConstruction,
    );
    this.#green = this.newPriceCalculator(definition.calculatorForGreen);
  }
  calculate(droppedFraction: DroppedFraction) {
    switch (droppedFraction.type) {
      case "Construction waste":
        return this.#construction.calculate(droppedFraction);
      case "Green waste":
        return this.#green.calculate(droppedFraction);
    }
  }

  private newPriceCalculator(definition: PriceCalculatorDefinition) {
    if ("pricePerKg" in definition) {
      return new PriceCalculatorFixedPrice(definition);
    } else {
      return new PriceCalculatorWithExcemptions(definition);
    }
  }
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
