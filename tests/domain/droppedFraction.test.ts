import DroppedFraction, {
  FractionType,
} from "../../src/domain/droppedFraction";
import Price, { Currency } from "../../src/domain/price";
import Weight from "../../src/domain/weight";

const PRICE_GREEN_PINEVILLE = 0.1;
const PRICE_CONSTRUCTION_PINEVILLE = 0.15;
const PRICE_GREEN_OAKCITY = 0.08;
const PRICE_CONSTRUCTION_OAKCITY = 0.19;

describe("FractionType", () => {
  test("Parse correct type", () => {
    expect(() =>
      FractionType.fromString("Green waste", "Pineville"),
    ).not.toThrow();
  });
  test("Parse incorrect type", () => {
    expect(() => FractionType.fromString("invalid", "invalid")).toThrow();
  });
});

describe("DroppedFraction.calculatePrice in Pineville", () => {
  const construction = FractionType.fromString(
    "Construction waste",
    "Pineville",
  );
  const green = FractionType.fromString("Green waste", "Pineville");

  test("Construction waste", () => {
    const dropped = new DroppedFraction(construction, new Weight(10));
    const actual = DroppedFraction.sum([dropped]);
    expect(
      actual.equal(new Price(10 * PRICE_CONSTRUCTION_PINEVILLE, Currency.EUR)),
    ).toBeTruthy();
  });

  test("Green waste", () => {
    const dropped = new DroppedFraction(green, new Weight(10));
    const actual = DroppedFraction.sum([dropped]);
    expect(
      actual.equal(new Price(10 * PRICE_GREEN_PINEVILLE, Currency.EUR)),
    ).toBeTruthy();
  });

  test("Multiple fractions dropped", () => {
    const actual = DroppedFraction.sum([
      new DroppedFraction(green, new Weight(100)),
      new DroppedFraction(construction, new Weight(200)),
    ]);
    expect(
      actual.equal(
        new Price(
          100 * PRICE_GREEN_PINEVILLE + 200 * PRICE_CONSTRUCTION_PINEVILLE,
          Currency.EUR,
        ),
      ),
    ).toBeTruthy();
  });
});

describe("DroppedFraction.calculatePrice in Oak City", () => {
  const construction = FractionType.fromString(
    "Construction waste",
    "Oak City",
  );
  const green = FractionType.fromString("Green waste", "Oak City");

  test("Multiple fractions dropped", () => {
    const actual = DroppedFraction.sum([
      new DroppedFraction(green, new Weight(100)),
      new DroppedFraction(construction, new Weight(200)),
    ]);
    expect(
      actual.equal(
        new Price(
          100 * PRICE_GREEN_OAKCITY + 200 * PRICE_CONSTRUCTION_OAKCITY,
          Currency.EUR,
        ),
      ),
    ).toBeTruthy();
  });
});
