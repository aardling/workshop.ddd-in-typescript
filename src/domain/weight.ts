export default class Weight {
  readonly #amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    this.#amount = amount;
  }

  equal(other: Weight) {
    return other.#amount === this.#amount;
  }

  get amount() {
    return this.#amount;
  }
}
