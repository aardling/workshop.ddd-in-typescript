import { ExternalVisitorService } from "../domain/externalTypes";
import { PersonId, Visitors, fromExternalVisitor } from "../domain/visitor";

export class InMemoryVisitors implements Visitors {
  #visitorService: ExternalVisitorService;

  constructor(visitorService: ExternalVisitorService) {
    this.#visitorService = visitorService;
  }
  async getVisitorByPersonId(personId: PersonId) {
    const externalVisitor = await this.#visitorService.getVisitorById(personId);
    if (!externalVisitor) {
      throw new Error(`No visitor found with id: ${personId}`);
    }
    return fromExternalVisitor(externalVisitor);
  }
}
