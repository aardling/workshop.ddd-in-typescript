import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import Price from "../domain/price";
import { Visit } from "../domain/visit";
import { PersonalVisitHistories } from "../domain/PersonalVisitHistories";
import { PersonalVisitHistory } from "../domain/PersonalVisitHistory";
import Weight from "../domain/weight";
import { PriceCalculators } from "../domain/PriceCalculation";
import { Visitor, Visitors } from "../domain/visitor";

interface CalculatePriceRequest {
  date: Date;
  visit: Visit;
  visit_id: string;
}

function parseCalculatePriceRequest(
  request: any,
  visitor: Visitor,
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
    visit: new Visit(new Date(request.date), visitor, droppedFractions),
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
  #personalVisitHistories: PersonalVisitHistories;
  #priceCalculators: PriceCalculators;
  #visitors: Visitors;

  constructor(
    visitors: Visitors,
    personalVisitHistories: PersonalVisitHistories,
    priceCalculators: PriceCalculators,
  ) {
    this.#visitors = visitors;
    this.#personalVisitHistories = personalVisitHistories;
    this.#priceCalculators = priceCalculators;
  }

  async calculate(request: any) {
    const visitor = await this.#visitors.getVisitorByPersonId(
      request.person_id,
    );
    if (!visitor) {
      throw new Error(
        `The visitor with id ${request.person_id} was not found.`,
      );
    }

    const calculatePriceRequest = parseCalculatePriceRequest(request, visitor);

    const personalVisitHistory = this.getPersonalVisitHistory(visitor);
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

  private getPersonalVisitHistory(visitor: Visitor) {
    let personalVisitHistory = this.#personalVisitHistories.getByPersonId(
      visitor.personId,
    );
    if (!personalVisitHistory) {
      personalVisitHistory = new PersonalVisitHistory(
        visitor,
        this.#priceCalculators,
      );
    }
    return personalVisitHistory;
  }
}
