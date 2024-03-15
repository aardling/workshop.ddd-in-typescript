import { post } from "../../infrastructure/request";
import { Event } from "../PriceWasCalculated";
import Price from "../price";

export class InvoiceHandler {
  async handle(event: Event) {
    switch (event.type) {
      case "PriceWasCalculated":
        console.log(event);
        if (event.visitorType === "business") {
          await this.sendInvoiceToBusinesCustomer(event.price, event.email!);
        }
        return;
    }
  }

  private async sendInvoiceToBusinesCustomer(price: Price, email: string) {
    await post("/api/invoice", {
      email,
      invoice_currency: price.value.currency,
      invoice_amount: price.value.amount,
    });
  }
}
