import Weight from "./weight";

enum FractionTypes {
  "Construction waste",
  "Green waste",
}

export type AllowedFractionType = keyof typeof FractionTypes;

function isAllowedFractionType(type: string): type is AllowedFractionType {
  return Object.values(FractionTypes).includes(type);
}

export class FractionType {
  readonly #type: AllowedFractionType;

  private constructor(type: AllowedFractionType) {
    this.#type = type;
  }

  static fromString(type: string): FractionType {
    if (!isAllowedFractionType(type)) {
      throw new Error(`Invalid fraction type: ${type}`);
    }
    return new FractionType(type);
  }

  get self() {
    return this.#type;
  }
}

export default class DroppedFraction {
  readonly #fractionType: FractionType;
  readonly #weight: Weight;

  constructor(fractionType: FractionType, weight: Weight) {
    this.#fractionType = fractionType;
    this.#weight = weight;
  }

  get weight() {
    return this.#weight;
  }

  get type() {
    return this.#fractionType.self;
  }
}
