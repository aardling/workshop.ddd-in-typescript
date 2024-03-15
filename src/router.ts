import { Request, Response, Router } from "express";
import bodyParser from "body-parser";

const routes = Router();
routes.use(bodyParser.json());

routes.get("/", (_request: Request, response: Response, _next) => {
  return response.json({ status: "OK" });
});

export { routes };
