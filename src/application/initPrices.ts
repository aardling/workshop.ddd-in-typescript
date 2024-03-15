import { priceKey } from "../domain/PriceCalculation";
import Price, { Currency } from "../domain/price";
import { InMemoryPriceCalculators } from "../infrastructure/inMemoryPriceCalculators";

export default function initPrices() {
  const priceCalculators = new InMemoryPriceCalculators();
  priceCalculators.add(priceKey("Pineville", "private", "Construction waste"), {
    pricePerKg: new Price(0.15, Currency.EUR),
  });
  priceCalculators.add(priceKey("Pineville", "private", "Green waste"), {
    pricePerKg: new Price(0.1, Currency.EUR),
  });
  priceCalculators.add(priceKey("Oak City", "private", "Construction waste"), {
    pricePerKg: new Price(0.19, Currency.EUR),
  });
  priceCalculators.add(priceKey("Oak City", "private", "Green waste"), {
    pricePerKg: new Price(0.08, Currency.EUR),
  });
  priceCalculators.add(
    priceKey("Pineville", "business", "Construction waste"),
    { pricePerKg: new Price(0.13, Currency.EUR) },
  );
  priceCalculators.add(priceKey("Pineville", "business", "Green waste"), {
    pricePerKg: new Price(0.12, Currency.EUR),
  });
  priceCalculators.add(priceKey("Oak City", "business", "Construction waste"), {
    pricePerKg: new Price(0.21, Currency.EUR),
  });
  priceCalculators.add(priceKey("Oak City", "business", "Green waste"), {
    pricePerKg: new Price(0.08, Currency.EUR),
  });
  priceCalculators.add(priceKey("Oak City", "business", "Construction waste"), {
    weightLimit: 1000,
    firstCalculator: { pricePerKg: new Price(0.21, Currency.EUR) },
    secondCalculator: { pricePerKg: new Price(0.29, Currency.EUR) },
  });
  return priceCalculators;
}
