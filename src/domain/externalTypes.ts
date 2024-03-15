export type ExternalVisitorType = "private" | "business";

export type ExternalVisitor = {
  type: ExternalVisitorType;
  id: string;
  address: string;
  city: string;
  email?: string;
};

export interface ExternalVisitorService {
  getVisitorById: (id: string) => Promise<ExternalVisitor | undefined>;
}
