import DroppedFraction, {
  FractionType,
} from "../../src/domain/droppedFraction";
import Price, { Currency } from "../../src/domain/price";
import Weight from "../../src/domain/weight";

const PRICE_GREEN = 0.1;
const PRICE_CONSTRUCTION = 0.15;

describe("FractionType", () => {
  test("Parse correct type", () => {
    expect(() => FractionType.fromString("Green waste")).not.toThrow();
  });
  test("Parse incorrect type", () => {
    expect(() => FractionType.fromString("invalid")).toThrow();
  });
});

describe("DroppedFraction.calculatePrice", () => {
  const construction = FractionType.fromString("Construction waste");
  const green = FractionType.fromString("Green waste");
  test("Construction waste", () => {
    const dropped = new DroppedFraction(construction, new Weight(10));
    const actual = DroppedFraction.sum([dropped]);
    expect(
      actual.equal(new Price(10 * PRICE_CONSTRUCTION, Currency.EUR)),
    ).toBeTruthy();
  });

  test("Green waste", () => {
    const dropped = new DroppedFraction(green, new Weight(10));
    const actual = DroppedFraction.sum([dropped]);
    expect(
      actual.equal(new Price(10 * PRICE_GREEN, Currency.EUR)),
    ).toBeTruthy();
  });

  test("Multiple fractions dropped", () => {
    const actual = DroppedFraction.sum([
      new DroppedFraction(green, new Weight(100)),
      new DroppedFraction(construction, new Weight(200)),
    ]);
    expect(
      actual.equal(
        new Price(100 * PRICE_GREEN + 200 * PRICE_CONSTRUCTION, Currency.EUR),
      ),
    ).toBeTruthy();
  });
});
