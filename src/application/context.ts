import { ExternalVisitorService } from "../domain/externalTypes";
import { Visits } from "../domain/visits";

export default class Context {
  readonly externalVisitorService: ExternalVisitorService;
  readonly visits: Visits;

  private constructor(externalVisitorService: ExternalVisitorService) {
    this.externalVisitorService = externalVisitorService;
    this.visits = new Visits();
  }

  // On every new scenario the context is initialized.
  // Use it for any setup you need to do.
  static initialize(externalVisitorService: ExternalVisitorService) {
    return new Context(externalVisitorService);
  }
}
