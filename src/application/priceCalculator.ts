import DroppedFraction, { FractionType } from "../domain/droppedFraction";
import Price from "../domain/price";
import { Visit } from "../domain/visit";
import Weight from "../domain/weight";
import { Visitor, Visitors } from "../domain/visitor";
import { CalculatorDefinitions } from "./initPrices";
import { VisitHistories } from "../domain/VisitHistories";
import { VisitHistory } from "../domain/VisitHistory";
import { MessageBus } from "../infrastructure/inMemoryMessageBus";

interface CalculatePriceRequest {
  date: Date;
  visit: Visit;
  visit_id: string;
}

const calculatorDefinitions = new CalculatorDefinitions();

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
  #visitHistories: VisitHistories;
  #visitors: Visitors;
  #messageBus: MessageBus;

  constructor(
    visitors: Visitors,
    visitHistories: VisitHistories,
    messageBus: MessageBus,
  ) {
    this.#visitors = visitors;
    this.#visitHistories = visitHistories;
    this.#messageBus = messageBus;
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

    const visitHistory = this.getVisitHistory(visitor);
    const calcualtedPrice = visitHistory.calculatePriceOfVisit(
      calculatePriceRequest.visit,
    );
    this.#visitHistories.save(visitHistory);

    this.#messageBus.publish(calcualtedPrice);

    return {
      person_id: calculatePriceRequest.visit.personId,
      visit_id: calculatePriceRequest.visit_id,
      ...formatPrice(calcualtedPrice.price),
    };
  }

  private getVisitHistory(visitor: Visitor) {
    let visitHistory = this.#visitHistories.getByUnitId(visitor.unitId);
    if (!visitHistory) {
      visitHistory = new VisitHistory(
        visitor,
        calculatorDefinitions.find(visitor),
      );
    }
    return visitHistory;
  }
}
