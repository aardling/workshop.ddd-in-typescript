import {
  ExternalVisitor,
  ExternalVisitorService,
} from "../domain/externalTypes";
import { get } from "../infrastructure/request";

export default class InMemoryExternalVisitorService
  implements ExternalVisitorService
{
  async getVisitorById(id: string) {
    const visitors = await this.#getAllVisitors();
    return visitors.find((v) => v.id === id);
  }

  async #getAllVisitors(): Promise<ReadonlyArray<ExternalVisitor>> {
    return (await get("/api/users")) as ReadonlyArray<ExternalVisitor>;
  }
}
