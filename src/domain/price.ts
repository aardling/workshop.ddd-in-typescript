export enum Currency {
  EUR,
}

export default class Price {
  readonly #amount: number;
  readonly #currency: Currency;

  constructor(amount: number, currency: Currency) {
    assert(amount >= 0, `Invalid amount: ${amount}`);

    this.#amount = amount;
    this.#currency = currency;
  }

  equal(other: Price) {
    return other.#currency === this.#currency && other.#amount === this.#amount;
  }

  add(other: Price) {
    assert(this.#currency === other.#currency, "The currencies don't match");
    return new Price(this.#amount + other.#amount, this.#currency);
  }

  times(factor: number): Price {
    return new Price(this.#amount * factor, this.#currency);
  }

  get value() {
    return {
      amount: this.#amount,
      currency: Currency[this.#currency],
    };
  }
}

function assert(assertion: boolean, message: string) {
  if (!assertion) {
    throw new Error(message);
  }
}
