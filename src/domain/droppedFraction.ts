import Price, { Currency } from "./price";
import Weight from "./weight";

enum FractionTypes {
  "Construction waste",
  "Green waste",
}

type AllowedFractionType = keyof typeof FractionTypes;
function isAllowedFractionType(type: string): type is AllowedFractionType {
  return Object.values(FractionTypes).includes(type);
}

const prices: Record<string, Record<AllowedFractionType, Price>> = {
  Pineville: {
    "Construction waste": new Price(0.15, Currency.EUR),
    "Green waste": new Price(0.1, Currency.EUR),
  },
  "Oak City": {
    "Construction waste": new Price(0.19, Currency.EUR),
    "Green waste": new Price(0.08, Currency.EUR),
  },
};

export class FractionType {
  readonly #type: AllowedFractionType;
  readonly #price: Price;

  private constructor(type: AllowedFractionType, city: string) {
    this.#type = type;
    this.#price = prices[city][type];
  }

  static fromString(type: string, city: string): FractionType {
    if (!isAllowedFractionType(type)) {
      throw new Error(`Invalid fraction type: ${type}`);
    }
    return new FractionType(type, city);
  }

  get price() {
    return this.#price;
  }
}

export default class DroppedFraction {
  readonly #fractionType: FractionType;
  readonly #weight: Weight;

  constructor(fractionType: FractionType, weight: Weight) {
    this.#fractionType = fractionType;
    this.#weight = weight;
  }

  static sum(droppedFractions: ReadonlyArray<DroppedFraction>): Price {
    return droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) =>
        price.add(droppedFraction.calculatePrice()),
      new Price(0, Currency.EUR),
    );
  }

  private calculatePrice(): Price {
    return this.#fractionType.price.times(this.#weight.amount);
  }
}
