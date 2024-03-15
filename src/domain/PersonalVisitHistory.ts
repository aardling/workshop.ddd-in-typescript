import DroppedFraction from "./droppedFraction";
import { PersonId, Visit } from "./visit";

export class PersonalVisitHistory {
  #personId: PersonId;
  #visits: Array<Visit>;

  constructor(personId: PersonId) {
    this.#personId = personId;
    this.#visits = [];
  }

  get person() {
    return this.#personId;
  }

  calculatePriceOfVisit(
    visit: Visit,
  ) {
    this.#visits.push(visit);

    let price = visit.price();
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
