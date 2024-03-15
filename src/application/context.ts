import { ExternalVisitorService } from "../domain/externalTypes";
import { InMemoryPersonalVisitHistories } from "../infrastructure/inMemoryPersonalVisitHistories";

export default class Context {
  readonly externalVisitorService: ExternalVisitorService;
  readonly personalVisitHistories: InMemoryPersonalVisitHistories;

  private constructor(externalVisitorService: ExternalVisitorService) {
    this.externalVisitorService = externalVisitorService;
    this.personalVisitHistories = new InMemoryPersonalVisitHistories();
  }

  // On every new scenario the context is initialized.
  // Use it for any setup you need to do.
  static initialize(externalVisitorService: ExternalVisitorService) {
    return new Context(externalVisitorService);
  }
}
