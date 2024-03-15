import { DefaultPriceCalculator, priceKey } from "../domain/PriceCalculation";
import Price, { Currency } from "../domain/price";
import { InMemoryPriceCalculators } from "../infrastructure/inMemoryPriceCalculators";

export default function initPrices() {
  const priceCalculators = new InMemoryPriceCalculators();
  priceCalculators.add(
    priceKey("Pineville", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.15, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Pineville", "Green waste"),
    new DefaultPriceCalculator(new Price(0.1, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.19, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "Green waste"),
    new DefaultPriceCalculator(new Price(0.08, Currency.EUR)),
  );
  return priceCalculators;
}
