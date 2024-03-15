import { ExternalVisitorService } from "../domain/externalTypes";
import { Visitors } from "../domain/visitor";
import {
  InMemoryMessageBus,
  MessageBus,
} from "../infrastructure/inMemoryMessageBus";
import { InMemoryVisitHistories } from "../infrastructure/inMemoryVisitHistories";
import { InMemoryVisitors } from "../infrastructure/inMemoryVisitors";

export default class Context {
  readonly visitors: Visitors;
  readonly visitHistories: InMemoryVisitHistories;
  readonly messageBus: MessageBus;

  private constructor(externalVisitorService: ExternalVisitorService) {
    this.visitHistories = new InMemoryVisitHistories();
    this.visitors = new InMemoryVisitors(externalVisitorService);
    this.messageBus = new InMemoryMessageBus();
  }

  // On every new scenario the context is initialized.
  // Use it for any setup you need to do.
  static initialize(externalVisitorService: ExternalVisitorService) {
    return new Context(externalVisitorService);
  }
}
