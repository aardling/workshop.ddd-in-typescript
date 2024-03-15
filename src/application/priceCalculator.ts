import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import {
  ExternalVisitor,
  ExternalVisitorService,
} from "../domain/externalTypes";
import Price from "../domain/price";
import { Visit } from "../domain/visit";
import { PersonalVisitHistories } from "../domain/PersonalVisitHistories";
import { PersonalVisitHistory } from "../domain/PersonalVisitHistory";
import Weight from "../domain/weight";
import { PriceCalculators } from "../domain/PriceCalculation";

interface CalculatePriceRequest {
  date: Date;
  visit: Visit;
  visit_id: string;
}

function parseCalculatePriceRequest(
  request: any,
  externalVisitor: ExternalVisitor,
): CalculatePriceRequest {
  const droppedFractions = request.dropped_fractions.map(
    (d: any) =>
      new DroppedFraction(
        FractionType.fromString(d.fraction_type),
        new Weight(d.amount_dropped),
      ),
  );

  return {
    date: new Date(request.date),
    visit: new Visit(
      new Date(request.date),
      request.person_id,
      externalVisitor,
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
  #priceCalculators: PriceCalculators;

  constructor(
    externalVisitorsService: ExternalVisitorService,
    personalVisitHistories: PersonalVisitHistories,
    priceCalculators: PriceCalculators,
  ) {
    this.#externalVisitorsService = externalVisitorsService;
    this.#personalVisitHistories = personalVisitHistories;
    this.#priceCalculators = priceCalculators;
  }

  async calculate(request: any) {
    const visitor = await this.#externalVisitorsService.getVisitorById(
      request.person_id,
    );
    const calculatePriceRequest = parseCalculatePriceRequest(request, visitor!);

    const personalVisitHistory = this.getPersonalVisitHistory(visitor!);
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

  private getPersonalVisitHistory(externalVisitor: ExternalVisitor) {
    let personalVisitHistory = this.#personalVisitHistories.getByPersonId(
      externalVisitor.id,
    );
    if (!personalVisitHistory) {
      personalVisitHistory = new PersonalVisitHistory(
        externalVisitor,
        this.#priceCalculators,
      );
    }
    return personalVisitHistory;
  }
}
