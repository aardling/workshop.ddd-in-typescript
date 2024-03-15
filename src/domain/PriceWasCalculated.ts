import Price from "./price";
import { PersonId } from "./visitor";

export type PriceWasCalculated = {
  type: "PriceWasCalculated";
  price: Price;
  personId: PersonId;
};
export type Event = PriceWasCalculated;
