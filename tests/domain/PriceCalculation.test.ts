import DroppedFraction, {
  FractionType,
} from "../../src/domain/droppedFraction";
import Price, { Currency } from "../../src/domain/price";
import { DefaultPriceCalculator } from "../../src/domain/PriceCalculation";
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
