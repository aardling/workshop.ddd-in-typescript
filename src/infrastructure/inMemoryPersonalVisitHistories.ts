import {
  PersonId,
} from "../domain/visit";
import { PersonalVisitHistories } from "../domain/PersonalVisitHistories";
import { PersonalVisitHistory } from "../domain/PersonalVisitHistory";

export class InMemoryPersonalVisitHistories implements PersonalVisitHistories {
  #peronalVisitHistories: { [key: PersonId]: PersonalVisitHistory } = {};

  getByPersonId(personId: PersonId) {
    return this.#peronalVisitHistories[personId];
  }

  save(visitsPerPerson: PersonalVisitHistory) {
    this.#peronalVisitHistories[visitsPerPerson.person] = visitsPerPerson;
  }
}
