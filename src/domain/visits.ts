import DroppedFraction from "./droppedFraction";

type PersonId = string;

export class Visit {
  #date: Date;
  #personId: string;

  constructor(date: Date, personId: PersonId) {
    this.#date = date;
    this.#personId = personId;
  }

  inSameMonth(other: Visit) {
    return (
      this.#personId === other.#personId &&
      this.#date.getFullYear() === other.#date.getFullYear() &&
      this.#date.getMonth() === other.#date.getMonth()
    );
  }
}

export class Visits {
  #visits: Array<Visit> = [];

  calculatePriceOfVisit(
    visit: Visit,
    droppedFractions: ReadonlyArray<DroppedFraction>,
  ) {
    this.#visits.push(visit);

    let price = DroppedFraction.sum(droppedFractions);
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
