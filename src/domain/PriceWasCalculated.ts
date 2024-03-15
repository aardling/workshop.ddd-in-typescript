import Price from "./price";
import { PersonId } from "./visitor";

export type PriceWasCalculated = {
  price: Price;
  personId: PersonId;
};
