type Visit = {
  date: Date;
};

export class Visits {
  #visits: Array<Visit> = [];

  visit(visit: Visit) {
    this.#visits.push(visit);
  }

  get numberOfVisitsInCurrentMonth() {
    const month = this.lastVisit.date.getMonth();
    return this.#visits.reduce((sum, visit) => {
      if (visit.date.getMonth() === month) {
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
