import Price from "./price";
import { PersonId, VisitorType } from "./visitor";

export type PriceWasCalculated = {
  type: "PriceWasCalculated";
  price: Price;
  personId: PersonId;
  email: string | undefined;
  visitorType: VisitorType;
};
export type Event = PriceWasCalculated;
