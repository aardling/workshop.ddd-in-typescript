import { Event } from "../domain/PriceWasCalculated";
type Subscriber = (event: Event) => Promise<void>;

export interface MessageBus {
  publish(event: Event): Promise<void>;
  subscribe(subscriber: Subscriber): void;
}

export class InMemoryMessageBus implements MessageBus {
  #subscribers: Array<Subscriber> = [];
  async publish(event: Event): Promise<void> {
    this.#subscribers.forEach(async (subscriber) => await subscriber(event));
  }
  subscribe(subscriber: Subscriber): void {
    this.#subscribers.push(subscriber);
  }
}
