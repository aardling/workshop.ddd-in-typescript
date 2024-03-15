import DroppedFraction from "./droppedFraction";
import Price, { Currency } from "./price";
import { Visit } from "./visit";
import { PriceCalculators } from "./PriceCalculation";
import { Visitor } from "./visitor";

export class PersonalVisitHistory {
  #visits: Array<Visit>;
  #priceCalculators: PriceCalculators;
  #visitor: Visitor;

  constructor(visitor: Visitor, priceCalculators: PriceCalculators) {
    this.#visitor = visitor;
    this.#visits = [];
    this.#priceCalculators = priceCalculators;
  }

  get person() {
    return this.#visitor.personId;
  }

  calculatePriceOfVisit(visit: Visit) {
    this.#visits.push(visit);

    let priceWithoutFee = visit.droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) => {
        let calculator = this.#priceCalculators.get(
          this.#visitor,
          droppedFraction.type,
        );
        return price.add(calculator.calculate(droppedFraction));
      },
      new Price(0, Currency.EUR),
    );

    let totalPrice = this.applyFee(visit, priceWithoutFee);
    return totalPrice;
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
