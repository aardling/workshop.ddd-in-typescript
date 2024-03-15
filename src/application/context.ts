import { ExternalVisitorService } from "../domain/externalTypes";
import { Visitors } from "../domain/visitor";
import { InMemoryVisitors } from "../infrastructure/inMemoryVisitors";
import { InMemoryPersonalVisitHistories } from "../infrastructure/inMemoryPersonalVisitHistories";
import { PriceCalculators } from "../domain/PriceCalculation";

export default class Context {
  readonly visitors: Visitors;
  readonly personalVisitHistories: InMemoryPersonalVisitHistories;
  readonly priceCalculators: PriceCalculators;

  private constructor(
    externalVisitorService: ExternalVisitorService,
    priceCalculators: PriceCalculators,
  ) {
    this.personalVisitHistories = new InMemoryPersonalVisitHistories();
    this.priceCalculators = priceCalculators;
    this.visitors = new InMemoryVisitors(externalVisitorService);
  }

  // On every new scenario the context is initialized.
  // Use it for any setup you need to do.
  static initialize(
    externalVisitorService: ExternalVisitorService,
    priceCalculators: PriceCalculators,
  ) {
    return new Context(externalVisitorService, priceCalculators);
  }
}
