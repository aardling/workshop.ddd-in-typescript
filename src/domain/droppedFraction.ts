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

const prices: Record<AllowedFractionType, Price> = {
  "Construction waste": new Price(0.15, Currency.EUR),
  "Green waste": new Price(0.1, Currency.EUR),
};

export class FractionType {
  readonly #type: AllowedFractionType;
  readonly #price: Price;

  private constructor(type: AllowedFractionType) {
    this.#type = type;
    this.#price = prices[type];
  }
  static fromString(type: string): FractionType {
    if (!isAllowedFractionType(type)) {
      throw new Error(`Invalid fraction type: ${type}`);
    }
    return new FractionType(type);
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

  calculatePrice(): Price {
    return this.#fractionType.price.times(this.#weight.amount);
  }
}
