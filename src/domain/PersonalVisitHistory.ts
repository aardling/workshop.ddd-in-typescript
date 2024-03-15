import DroppedFraction from "./droppedFraction";
import Price, { Currency } from "./price";
import { PersonId, Visit } from "./visit";
import { PriceCalculators, priceKey } from "./PriceCalculation";

export class PersonalVisitHistory {
  #personId: PersonId;
  #visits: Array<Visit>;
  #priceCalculators: PriceCalculators;

  constructor(personId: PersonId, priceCalculators: PriceCalculators) {
    this.#personId = personId;
    this.#visits = [];
    this.#priceCalculators = priceCalculators;
  }

  get person() {
    return this.#personId;
  }

  calculatePriceOfVisit(visit: Visit) {
    this.#visits.push(visit);

    let price = visit.droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) => {
        let calculator = this.#priceCalculators.find(
          priceKey(visit.city, droppedFraction.type),
        );
        return price.add(calculator.calculate(droppedFraction));
      },
      new Price(0, Currency.EUR),
    );

    if (this.numberOfVisitsInCurrentMonth >= 3) {
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
