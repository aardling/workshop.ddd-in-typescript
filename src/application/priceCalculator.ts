import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import { ExternalVisitorService } from "../domain/externalTypes";
import Price from "../domain/price";
import { Visit, Visits } from "../domain/visits";
import Weight from "../domain/weight";

interface CalculatePriceRequest {
  date: Date;
  visit: Visit;
  droppedFractions: ReadonlyArray<DroppedFraction>;
  person_id: string;
  visit_id: string;
}

function parseCalculatePriceRequest(
  request: any,
  city: string,
): CalculatePriceRequest {
  return {
    date: new Date(request.date),
    visit: new Visit(new Date(request.date), request.person_id),
    droppedFractions: request.dropped_fractions.map(
      (d: any) =>
        new DroppedFraction(
          FractionType.fromString(d.fraction_type, city),
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
  #visits: Visits;

  constructor(externalVisitorsService: ExternalVisitorService, visits: Visits) {
    this.#externalVisitorsService = externalVisitorsService;
    this.#visits = visits;
  }

  async calculate(request: any) {
    const visitor = await this.#externalVisitorsService.getVisitorById(
      request.person_id,
    );
    const calculatePriceRequest = parseCalculatePriceRequest(
      request,
      visitor!.city,
    );

    const price = this.#visits.calculatePriceOfVisit(
      calculatePriceRequest.visit,
      calculatePriceRequest.droppedFractions,
    );

    return {
      person_id: calculatePriceRequest.person_id,
      visit_id: calculatePriceRequest.visit_id,
      ...formatPrice(price),
    };
  }
}
