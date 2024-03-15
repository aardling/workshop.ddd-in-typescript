import { DefaultPriceCalculator, priceKey } from "../domain/PriceCalculation";
import Price, { Currency } from "../domain/price";
import { InMemoryPriceCalculators } from "../infrastructure/inMemoryPriceCalculators";

export default function initPrices() {
  const priceCalculators = new InMemoryPriceCalculators();
  priceCalculators.add(
    priceKey("Pineville", "private", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.15, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Pineville", "private", "Green waste"),
    new DefaultPriceCalculator(new Price(0.1, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "private", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.19, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "private", "Green waste"),
    new DefaultPriceCalculator(new Price(0.08, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Pineville", "business", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.13, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Pineville", "business", "Green waste"),
    new DefaultPriceCalculator(new Price(0.12, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "business", "Construction waste"),
    new DefaultPriceCalculator(new Price(0.21, Currency.EUR)),
  );
  priceCalculators.add(
    priceKey("Oak City", "business", "Green waste"),
    new DefaultPriceCalculator(new Price(0.08, Currency.EUR)),
  );
  return priceCalculators;
}
