import { ExternalVisitorService } from "../domain/externalTypes";
import { InMemoryPersonalVisitHistories } from "../infrastructure/inMemoryPersonalVisitHistories";
import { PriceCalculators } from "../domain/PriceCalculation";

export default class Context {
  readonly externalVisitorService: ExternalVisitorService;
  readonly personalVisitHistories: InMemoryPersonalVisitHistories;
  readonly priceCalculators: PriceCalculators;

  private constructor(
    externalVisitorService: ExternalVisitorService,
    priceCalculators: PriceCalculators,
  ) {
    this.externalVisitorService = externalVisitorService;
    this.personalVisitHistories = new InMemoryPersonalVisitHistories();
    this.priceCalculators = priceCalculators;
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
