type PersonId = string;
type VisitId = string;

export class Visit {
  #date: Date;
  #visitId: string;
  #personId: string;

  constructor(date: Date, visitId: VisitId, personId: PersonId) {
    this.#date = date;
    this.#visitId = visitId;
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

  visit(visit: Visit) {
    this.#visits.push(visit);
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
