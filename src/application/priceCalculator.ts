export default class PriceCalculatorService {
  calculate(visit: any) {
    const priceAmount = visit.dropped_fractions.reduce(
      (price: number, d: any) =>
        price +
        d.amount_dropped * (d.fraction_type === "Green waste" ? 0.1 : 0.15),
      0,
    );
    return {
      price_amount: priceAmount,
      price_currency: "EUR",
      person_id: (visit as any).person_id,
      visit_id: (visit as any).visit_id,
    };
  }
}
