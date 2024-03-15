export type ExternalVisitor = {
  type: "private" | "business";
  id: string;
  address: string;
  city: string;
};

export interface ExternalVisitorService {
  getVisitorById: (id: string) => Promise<ExternalVisitor | undefined>;
}
