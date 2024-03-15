import { FractionType } from "../../src/domain/droppedFraction";

describe("FractionType", () => {
  test("Parse correct type", () => {
    expect(() => FractionType.fromString("Green waste")).not.toThrow();
  });
  test("Parse incorrect type", () => {
    expect(() => FractionType.fromString("invalid")).toThrow();
  });
});
