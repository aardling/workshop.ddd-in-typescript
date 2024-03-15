import { AllowedFractionType } from "../domain/droppedFraction";
import { ExternalVisitor } from "../domain/externalTypes";
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

type VistorPriceKey = `${PersonId}-${string}`;

export class InMemoryPriceCalculators implements PriceCalculators {
  readonly #definitions: { [key: PriceKey]: PriceCalculatorDefinition } = {};
  readonly #calculators: { [key: VistorPriceKey]: PriceCalculator } = {};

  add(key: PriceKey, definition: PriceCalculatorDefinition) {
    this.#definitions[key] = definition;
  }
  get(visitor: ExternalVisitor, fractionType: AllowedFractionType) {
    const key = priceKey(visitor.city, visitor.type, fractionType);
    const visitorPriceKey: VistorPriceKey = `${visitor.id}-${fractionType}`;
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
}
