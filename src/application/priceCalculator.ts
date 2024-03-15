import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import { ExternalVisitorService } from "../domain/externalTypes";
import Price from "../domain/price";
import { PersonId, Visit } from "../domain/visit";
import { PersonalVisitHistories } from "../domain/PersonalVisitHistories";
import { PersonalVisitHistory } from "../domain/PersonalVisitHistory";
import Weight from "../domain/weight";

interface CalculatePriceRequest {
  date: Date;
  visit: Visit;
  visit_id: string;
}

function parseCalculatePriceRequest(
  request: any,
  city: string,
): CalculatePriceRequest {
  const droppedFractions = request.dropped_fractions.map(
    (d: any) =>
      new DroppedFraction(
        FractionType.fromString(d.fraction_type, city),
        new Weight(d.amount_dropped),
      ),
  );

  return {
    date: new Date(request.date),
    visit: new Visit(
      new Date(request.date),
      request.person_id,
      droppedFractions,
    ),
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
  #personalVisitHistories: PersonalVisitHistories;

  constructor(
    externalVisitorsService: ExternalVisitorService,
    personalVisitHistories: PersonalVisitHistories,
  ) {
    this.#externalVisitorsService = externalVisitorsService;
    this.#personalVisitHistories = personalVisitHistories;
  }

  async calculate(request: any) {
    const visitor = await this.#externalVisitorsService.getVisitorById(
      request.person_id,
    );
    const calculatePriceRequest = parseCalculatePriceRequest(
      request,
      visitor!.city,
    );

    const personalVisitHistory = this.getPersonalVisitHisotry(
      calculatePriceRequest.visit.personId,
    );
    const price = personalVisitHistory.calculatePriceOfVisit(
      calculatePriceRequest.visit,
    );
    this.#personalVisitHistories.save(personalVisitHistory);

    return {
      person_id: calculatePriceRequest.visit.personId,
      visit_id: calculatePriceRequest.visit_id,
      ...formatPrice(price),
    };
  }

  private getPersonalVisitHisotry(personId: PersonId) {
    let personalVisitHistory =
      this.#personalVisitHistories.getByPersonId(personId);
    if (!personalVisitHistory) {
      personalVisitHistory = new PersonalVisitHistory(personId);
    }
    return personalVisitHistory;
  }
}
