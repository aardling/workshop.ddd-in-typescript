import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import InMemoryExternalVisitorService from "./internal/inMemoryExternalVisitorService";
import Context from "./application/context";
import PriceCalculatorService from "./application/priceCalculator";
import { InvoiceHandler } from "./domain/invoicing/InvoiceHandler";

const routes = Router();
routes.use(bodyParser.json());

let context: Context;

routes.get("/", (_request: Request, response: Response, _next) => {
  return response.json({ status: "OK" });
});

routes.post("/calculatePrice", async (request: Request, response: Response) => {
  console.log("request: ", request.body);

  const priceCalculator = new PriceCalculatorService(
    context.visitors,
    context.visitHistories,
    context.messageBus,
  );
  const result = await priceCalculator.calculate(request.body);

  console.log("response: ", result);

  return response.json(result);
});

// This is so you know when a new scenario starts, in case you need to
// setup, reset certain things
routes.post("/startScenario", (_request: Request, response: Response) => {
  console.log("starting scenario");

  initializeContext();

  return response.json({});
});

function initializeContext() {
  context = Context.initialize(new InMemoryExternalVisitorService());
  const invoiceHandler = new InvoiceHandler();
  context.messageBus.subscribe(invoiceHandler.handle.bind(invoiceHandler));
}

export { routes };
