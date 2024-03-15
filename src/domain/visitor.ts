import { ExternalVisitor } from "./externalTypes";

export type PersonId = string;
export type UnitId = string;
export type VisitorType = "private" | "business";

export interface Visitors {
  getVisitorByPersonId: (personId: PersonId) => Promise<Visitor>;
}

export interface Visitor {
  personId: PersonId;
  city: string;
  unitId: UnitId;
  type: VisitorType;
  email?: string;
}

export function fromExternalVisitor(externalVisitor: ExternalVisitor) {
  switch (externalVisitor.type) {
    case "private":
      return new PrivateVisitor(
        externalVisitor.id,
        externalVisitor.address,
        externalVisitor.city,
      );
    case "business":
      return new BusinessVisitor(
        externalVisitor.id,
        externalVisitor.address,
        externalVisitor.city,
        externalVisitor.email,
      );
    default:
      throw new Error(
        `Unknow visitor type: ${externalVisitor.type} - ${externalVisitor}`,
      );
  }
}

class PrivateVisitor implements Visitor {
  #personId: PersonId;
  #address: string;
  readonly city: string;
  constructor(personId: PersonId, address: string, city: string) {
    this.#personId = personId;
    this.#address = address;
    this.city = city;
  }
  get unitId() {
    return this.#personId;
  }

  get personId() {
    return this.#personId;
  }

  get type() {
    return "private" as VisitorType;
  }
}
class BusinessVisitor implements Visitor {
  #personId: PersonId;
  #address: string;
  readonly city: string;
  readonly email: string;

  constructor(
    personId: PersonId,
    address: string,
    city: string,
    email: string | undefined,
  ) {
    this.#personId = personId;
    this.#address = address;
    this.city = city;
    if (!email) console.error("Business customers needs an email");
    this.email = email ? email : "fallback-internal@ddd-in-lang-support.eu";
  }
  get unitId() {
    return `${this.#address} - ${this.city}`;
  }
  get personId() {
    return this.#personId;
  }
  get type() {
    return "business" as VisitorType;
  }
}
