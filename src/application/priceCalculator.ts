import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import { ExternalVisitorService } from "../domain/externalTypes";
import Price from "../domain/price";
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
          new Weight(d.amount_dropped),
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
  #externalVisitorsService: ExternalVisitorService;

  constructor(externalVisitorsService: ExternalVisitorService) {
    this.#externalVisitorsService = externalVisitorsService;
  }

  async calculate(request: any) {
    const calculatePriceRequest = parseCalculatePriceRequest(request);

    const price = DroppedFraction.sum(calculatePriceRequest.droppedFractions);

    return {
      person_id: calculatePriceRequest.person_id,
      visit_id: calculatePriceRequest.visit_id,
      ...formatPrice(price),
    };
  }
}
