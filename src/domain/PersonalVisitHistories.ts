import { PersonalVisitHistory } from "./PersonalVisitHistory";
import { PersonId } from "./visit";

export interface PersonalVisitHistories {
  getByPersonId: (personId: PersonId) => PersonalVisitHistory | undefined;
  save: (visitsPerPerson: PersonalVisitHistory) => void;
}
