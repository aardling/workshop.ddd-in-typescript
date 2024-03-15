import Weight from "../../src/domain/weight";

describe("Weight", () => {
  test("price can't be below 0", () => {
    expect(() => new Weight(-1)).toThrow();
  });

  test("price can be 0", () => {
    expect(() => new Weight(0)).not.toThrow();
  });

  test("equal", () => {
    expect(new Weight(1).equal(new Weight(1))).toBeTruthy();
  });

  test("not equal", () => {
    expect(new Weight(0).equal(new Weight(1))).toBeFalsy();
  });
});
