import { post } from "../../infrastructure/request";
import { Event } from "../PriceWasCalculated";

export class InvoiceHandler {
  async handle(event: Event) {
    switch (event.type) {
      case "PriceWasCalculated":
        await post("/api/invoice", {
          email: "beavers@dam-building.com",
          invoice_currency: event.price.value.currency,
          invoice_amount: event.price.value.amount,
        });
        return;
    }
  }
}
