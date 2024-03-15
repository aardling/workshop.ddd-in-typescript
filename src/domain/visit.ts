import DroppedFraction from "./droppedFraction";
import { ExternalVisitor } from "./externalTypes";

export type PersonId = string;

export class Visit {
  #date: Date;
  #visitor: ExternalVisitor;
  #droppedFractions: ReadonlyArray<DroppedFraction>;

  constructor(
    date: Date,
    visitor: ExternalVisitor,
    droppedFractions: ReadonlyArray<DroppedFraction>,
  ) {
    this.#date = date;
    this.#visitor = visitor;
    this.#droppedFractions = droppedFractions;
  }

  get type() {
    return this.#visitor.type;
  }

  get personId() {
    return this.#visitor.id;
  }

  get city() {
    return this.#visitor.city;
  }

  get droppedFractions() {
    return this.#droppedFractions;
  }

  inSameMonth(other: Visit) {
    return (
      this.personId === other.personId &&
      this.#date.getFullYear() === other.#date.getFullYear() &&
      this.#date.getMonth() === other.#date.getMonth()
    );
  }
}
