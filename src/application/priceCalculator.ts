import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import Price, { Currency } from "../domain/price";
import Weight from "../domain/weight";

interface CalculatePriceRequest {
  date: string;
  droppedFractions: ReadonlyArray<DroppedFraction>;
  person_id: string;
  visit_id: string;
}

function parseCalculatePriceRequest(request: any): CalculatePriceRequest {
  return {
    date: request.date,
    droppedFractions: request.dropped_fractions.map(
      (d: any) =>
        new DroppedFraction(
          FractionType.fromString(d.fraction_type),
          Weight.fromJson(d.amount_dropped, "KG"),
        ),
    ),
    person_id: request.person_id,
    visit_id: request.visit_id,
  };
}

function formatPrice(p: Price) {
  const value = p.value;
  return {
    price_amount: value.amount,
    price_currency: value.currency,
  };
}

export default class PriceCalculatorService {
  calculate(request: any) {
    const calculatePriceRequest = parseCalculatePriceRequest(request);
    const price = calculatePriceRequest.droppedFractions.reduce<Price>(
      (price: Price, droppedFraction: DroppedFraction) =>
        price.add(droppedFraction.calculatePrice()),
      new Price(0, Currency.EUR),
    );

    return {
      person_id: calculatePriceRequest.person_id,
      visit_id: calculatePriceRequest.visit_id,
      ...formatPrice(price),
    };
  }
}
