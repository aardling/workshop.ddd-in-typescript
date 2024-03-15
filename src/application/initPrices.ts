import { PriceCalculatorDefinition } from "../domain/PriceCalculation";
import { AllowedFractionType } from "../domain/droppedFraction";
import Price, { Currency } from "../domain/price";
import { Visitor, VisitorType } from "../domain/visitor";

type PriceKey = `${AllowedFractionType}_${VisitorType}_${string}`;
function priceKey(
  city: string,
  visitorType: VisitorType,
  fractionType: AllowedFractionType,
): PriceKey {
  return `${fractionType}_${visitorType}_${city}`;
}

export class CalculatorDefinitions {
  readonly #definitions: { [key: PriceKey]: PriceCalculatorDefinition } = {};

  constructor() {
    this.add(priceKey("Pineville", "private", "Construction waste"), {
      pricePerKg: new Price(0.15, Currency.EUR),
    });
    this.add(priceKey("Pineville", "private", "Green waste"), {
      pricePerKg: new Price(0.1, Currency.EUR),
    });
    this.add(priceKey("Oak City", "private", "Construction waste"), {
      pricePerKg: new Price(0.19, Currency.EUR),
    });
    this.add(priceKey("Oak City", "private", "Green waste"), {
      pricePerKg: new Price(0.08, Currency.EUR),
    });
    this.add(priceKey("Pineville", "business", "Construction waste"), {
      pricePerKg: new Price(0.13, Currency.EUR),
    });
    this.add(priceKey("Pineville", "business", "Green waste"), {
      pricePerKg: new Price(0.12, Currency.EUR),
    });
    this.add(priceKey("Oak City", "business", "Construction waste"), {
      pricePerKg: new Price(0.21, Currency.EUR),
    });
    this.add(priceKey("Oak City", "business", "Green waste"), {
      pricePerKg: new Price(0.08, Currency.EUR),
    });
    this.add(priceKey("Oak City", "business", "Construction waste"), {
      weightLimit: 1000,
      firstCalculator: { pricePerKg: new Price(0.21, Currency.EUR) },
      secondCalculator: { pricePerKg: new Price(0.29, Currency.EUR) },
    });
  }

  add(key: PriceKey, definition: PriceCalculatorDefinition) {
    this.#definitions[key] = definition;
  }

  find(visitor: Visitor) {
    const green =
      this.#definitions[priceKey(visitor.city, visitor.type, "Green waste")];
    const construction =
      this.#definitions[
        priceKey(visitor.city, visitor.type, "Construction waste")
      ];
    return {
      calculatorForConstruction: construction,
      calculatorForGreen: green,
    };
  }
}
