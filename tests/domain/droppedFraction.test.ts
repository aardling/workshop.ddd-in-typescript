import DroppedFraction, {
  FractionType,
} from "../../src/domain/droppedFraction";
import Price, { Currency } from "../../src/domain/price";
import Weight from "../../src/domain/weight";

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
  const weightAmount = 10;
  test("Construction waste", () => {
    const dropped = new DroppedFraction(construction, new Weight(weightAmount));
    expect(
      dropped
        .calculatePrice()
        .equal(new Price(weightAmount * 0.15, Currency.EUR)),
    ).toBeTruthy();
  });

  test("Green waste", () => {
    const dropped = new DroppedFraction(green, new Weight(weightAmount));
    expect(
      dropped
        .calculatePrice()
        .equal(new Price(weightAmount * 0.1, Currency.EUR)),
    ).toBeTruthy();
  });
});
