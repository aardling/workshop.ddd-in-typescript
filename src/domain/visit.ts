import DroppedFraction from "./droppedFraction";

export type PersonId = string;

export class Visit {
  #date: Date;
  #personId: string;
  #droppedFractions: ReadonlyArray<DroppedFraction>;

  constructor(
    date: Date,
    personId: PersonId,
    droppedFractions: ReadonlyArray<DroppedFraction>
  ) {
    this.#date = date;
    this.#personId = personId;
    this.#droppedFractions = droppedFractions;
  }

  get personId() {
    return this.#personId;
  }

  price() {
    return DroppedFraction.sum(this.#droppedFractions);
  }

  inSameMonth(other: Visit) {
    return (
      this.#personId === other.#personId &&
      this.#date.getFullYear() === other.#date.getFullYear() &&
      this.#date.getMonth() === other.#date.getMonth()
    );
  }
}
