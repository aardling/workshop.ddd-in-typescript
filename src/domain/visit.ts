import DroppedFraction from "./droppedFraction";
import { ExternalVisitor } from "./externalTypes";
import { Visitor } from "./visitor";

export type PersonId = string;

export class Visit {
  #date: Date;
  #visitor: Visitor;
  #droppedFractions: ReadonlyArray<DroppedFraction>;

  constructor(
    date: Date,
    visitor: Visitor,
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
    return this.#visitor.personId;
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
