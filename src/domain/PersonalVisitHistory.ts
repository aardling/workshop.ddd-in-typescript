import DroppedFraction from "./droppedFraction";
import Price, { Currency } from "./price";
import { PersonId, Visit } from "./visit";
import { DefaultPriceCalculator, PriceQuery, Prices } from "./PriceCalculation";

export class PersonalVisitHistory {
  #personId: PersonId;
  #visits: Array<Visit>;
  #prices: Prices;

  constructor(personId: PersonId) {
    this.#personId = personId;
    this.#visits = [];
    this.#prices = new Prices();
    this.#prices.add(
      new PriceQuery("Pineville", "Construction waste").toKey(),
      new DefaultPriceCalculator(new Price(0.15, Currency.EUR)),
    );
    this.#prices.add(
      new PriceQuery("Pineville", "Green waste").toKey(),
      new DefaultPriceCalculator(new Price(0.1, Currency.EUR)),
    );
    this.#prices.add(
      new PriceQuery("Oak City", "Construction waste").toKey(),
      new DefaultPriceCalculator(new Price(0.19, Currency.EUR)),
    );
    this.#prices.add(
      new PriceQuery("Oak City", "Green waste").toKey(),
      new DefaultPriceCalculator(new Price(0.08, Currency.EUR)),
    );
  }

  get person() {
    return this.#personId;
  }

  calculatePriceOfVisit(visit: Visit) {
    this.#visits.push(visit);

    let price = visit.droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) => {
        let calculator = this.#prices.find(
          new PriceQuery(visit.city, droppedFraction.type),
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
