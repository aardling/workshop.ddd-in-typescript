import DroppedFraction, {
  FractionType,
} from "../../src/domain/droppedFraction";
import Price, { Currency } from "../../src/domain/price";
import {
  DefaultPriceCalculator,
  PriceCalculatorWithExcemptions,
} from "../../src/domain/PriceCalculation";
import Weight from "../../src/domain/weight";

const construction = FractionType.fromString("Construction waste");
const weightAmount = 10;

test("Default Price Calculator", () => {
  const dropped = new DroppedFraction(construction, new Weight(weightAmount));
  const calculator = new DefaultPriceCalculator(new Price(0.15, Currency.EUR));
  expect(
    calculator
      .calculate(dropped)
      .equal(new Price(weightAmount * 0.15, Currency.EUR)),
  ).toBeTruthy();
});

describe("PriceCalculatorWithExcemptions", () => {
  const firstCalculator = new DefaultPriceCalculator(
    new Price(0.1, Currency.EUR),
  );
  const secondCalculator = new DefaultPriceCalculator(
    new Price(0.2, Currency.EUR),
  );

  test("1 drop under limit", () => {
    const dropped = new DroppedFraction(construction, new Weight(50));
    const calculator = new PriceCalculatorWithExcemptions(
      100,
      firstCalculator,
      secondCalculator,
    );

    expect(
      calculator.calculate(dropped).equal(new Price(50 * 0.1, Currency.EUR)),
    ).toBeTruthy();
  });

  test("1 drop over limit", () => {
    const dropped = new DroppedFraction(construction, new Weight(220));
    const calculator = new PriceCalculatorWithExcemptions(
      100,
      firstCalculator,
      secondCalculator,
    );

    expect(
      calculator
        .calculate(dropped)
        .equal(
          new Price(100 * 0.1, Currency.EUR).add(
            new Price(120 * 0.2, Currency.EUR),
          ),
        ),
    ).toBeTruthy();
  });

  test("in multiple drops over limit", () => {
    const dropped1 = new DroppedFraction(construction, new Weight(20));
    const dropped2 = new DroppedFraction(construction, new Weight(120));
    const dropped3 = new DroppedFraction(construction, new Weight(50));
    const calculator = new PriceCalculatorWithExcemptions(
      100,
      firstCalculator,
      secondCalculator,
    );

    expect(
      calculator
        .calculate(dropped1)
        .equal(
          new Price(20 * 0.1, Currency.EUR).add(
            new Price(0 * 0.2, Currency.EUR),
          ),
        ),
    ).toBeTruthy();

    expect(
      calculator
        .calculate(dropped2)
        .equal(
          new Price(80 * 0.1, Currency.EUR).add(
            new Price(40 * 0.2, Currency.EUR),
          ),
        ),
    ).toBeTruthy();

    expect(
      calculator
        .calculate(dropped3)
        .equal(
          new Price(0 * 0.1, Currency.EUR).add(
            new Price(50 * 0.2, Currency.EUR),
          ),
        ),
    ).toBeTruthy();
  });
});
