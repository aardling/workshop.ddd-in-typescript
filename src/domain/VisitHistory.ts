import DroppedFraction from "./droppedFraction";
import Price, { Currency } from "./price";
import { Visit } from "./visit";
import {
  ComposedPriceCalculator,
  ComposedPriceCalculatorDefinition,
} from "./PriceCalculation";
import { Visitor } from "./visitor";
import { PriceWasCalculated } from "./PriceWasCalculated";

export class VisitHistory {
  #visits: Array<Visit>;
  #priceCalculator: ComposedPriceCalculator;
  #visitor: Visitor;

  constructor(
    visitor: Visitor,
    calculatorDefiniton: ComposedPriceCalculatorDefinition,
  ) {
    this.#visitor = visitor;
    this.#visits = [];
    this.#priceCalculator = new ComposedPriceCalculator(calculatorDefiniton);
  }

  get unit() {
    return this.#visitor.unitId;
  }

  calculatePriceOfVisit(visit: Visit): PriceWasCalculated {
    this.#visits.push(visit);

    let priceWithoutFee = visit.droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) => {
        return price.add(this.#priceCalculator.calculate(droppedFraction));
      },
      new Price(0, Currency.EUR),
    );

    let totalPrice = this.applyFee(visit, priceWithoutFee);
    return {
      type: "PriceWasCalculated",
      price: totalPrice,
      personId: visit.personId,
    };
  }

  private applyFee(visit: Visit, price: Price) {
    if (visit.type === "private" && this.numberOfVisitsInCurrentMonth >= 3) {
      price = price.times(1.05);
    }
    return price;
  }

  get numberOfVisitsInCurrentMonth() {
    return this.#visits.reduce((sum, visit) => {
      if (visit.inSameMonth(this.lastVisit)) {
        return sum + 1;
      } else {
        return sum;
      }
    }, 0);
  }

  private get lastVisit() {
    return this.#visits[this.#visits.length - 1];
  }
}
