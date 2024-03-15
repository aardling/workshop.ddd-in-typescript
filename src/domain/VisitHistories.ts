import { VisitHistory } from "./VisitHistory";
import { PersonId } from "./visit";

export interface VisitHistories {
  getByUnitId: (personId: PersonId) => VisitHistory | undefined;
  save: (visitsPerPerson: VisitHistory) => void;
}
