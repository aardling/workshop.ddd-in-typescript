import { AllowedFractionType } from "../domain/droppedFraction";
import {
  PriceCalculator,
  PriceCalculatorDefinition,
  PriceCalculatorFixedPrice,
  PriceCalculatorWithExcemptions,
  PriceCalculators,
  PriceKey,
  priceKey,
} from "../domain/PriceCalculation";
import { PersonId } from "../domain/visit";
import { Visitor } from "../domain/visitor";

type VistorPriceKey = `${PersonId}-${string}`;

export class InMemoryPriceCalculators implements PriceCalculators {
  readonly #definitions: { [key: PriceKey]: PriceCalculatorDefinition } = {};
  readonly #calculators: { [key: VistorPriceKey]: PriceCalculator } = {};

  add(key: PriceKey, definition: PriceCalculatorDefinition) {
    this.#definitions[key] = definition;
  }
  get(visitor: Visitor, fractionType: AllowedFractionType) {
    const key = priceKey(visitor.city, visitor.type, fractionType);
    const visitorPriceKey: VistorPriceKey = `${visitor.personId}-${fractionType}`;
    let calculator = this.#calculators[visitorPriceKey];
    if (!calculator) {
      const definition = this.#definitions[key];
      if ("pricePerKg" in definition) {
        calculator = new PriceCalculatorFixedPrice(definition);
      } else {
        calculator = new PriceCalculatorWithExcemptions(definition);
      }
      this.#calculators[visitorPriceKey] = calculator;
    }
    return calculator;
  }

  save(_: PriceCalculator) {
    // this is a no-op because the in memory calculators are already updated
    // to better simulate a real repo, we should clone the price calculator
    // before returning it in the `get` method, but that's not trivial
    // with javascript classess.
    // we could implement a clone method on the PriceCalculators, but that
    // would only be needed because of this implementation detail...
  }
}
