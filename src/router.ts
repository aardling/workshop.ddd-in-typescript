import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import PriceCalculatorService from "./application/priceCalculator";

const routes = Router();
routes.use(bodyParser.json());

routes.get("/", (_request: Request, response: Response, _next) => {
  return response.json({ status: "OK" });
});

routes.post("/calculatePrice", (request: Request, response: Response) => {
  console.log("request: ", request.body);

  const result = new PriceCalculatorService().calculate(request.body);

  console.log("response: ", result);

  return response.json(result);
});

// This is so you know when a new scenario starts, in case you need to
// setup, reset certain things
routes.post("/startScenario", (_request: Request, response: Response) => {
  console.log("starting scenario");

  return response.json({});
});

export { routes };
