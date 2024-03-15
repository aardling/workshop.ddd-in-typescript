export default class PriceCalculatorService {
  calculate(visit: object) {
    return {
      price_amount: 0,
      price_currency: "EUR",
      person_id: (visit as any).person_id,
      visit_id: (visit as any).visit_id,
    };
  }
}
