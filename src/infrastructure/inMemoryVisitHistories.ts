import { VisitHistories } from "../domain/VisitHistories";
import { VisitHistory } from "../domain/VisitHistory";
import { PersonId } from "../domain/visit";

export class InMemoryVisitHistories implements VisitHistories {
  #peronalVisitHistories: { [key: PersonId]: VisitHistory } = {};

  getByUnitId(personId: PersonId) {
    return this.#peronalVisitHistories[personId];
  }

  save(visitsPerPerson: VisitHistory) {
    this.#peronalVisitHistories[visitsPerPerson.unit] = visitsPerPerson;
  }
}
