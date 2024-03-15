import { ExternalVisitorService } from "../domain/externalTypes";

export default class Context {
  readonly externalVisitorService: ExternalVisitorService;

  private constructor(externalVisitorService: ExternalVisitorService) {
    this.externalVisitorService = externalVisitorService;
  }

  // On every new scenario the context is initialized.
  // Use it for any setup you need to do.
  static initialize(externalVisitorService: ExternalVisitorService) {
    return new Context(externalVisitorService);
  }
}
