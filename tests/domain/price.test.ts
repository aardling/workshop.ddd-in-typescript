import Price, { Currency } from "../../src/domain/price";

describe("Price", () => {
  test("price can't be below 0", () => {
    expect(() => new Price(-1, Currency.EUR)).toThrow();
  });

  test("price can be 0", () => {
    expect(() => new Price(0, Currency.EUR)).not.toThrow();
  });

  test("equal", () => {
    expect(
      new Price(1, Currency.EUR).equal(new Price(1, Currency.EUR)),
    ).toBeTruthy();
  });

  test("not equal", () => {
    expect(
      new Price(0, Currency.EUR).equal(new Price(1, Currency.EUR)),
    ).toBeFalsy();
  });

  test("adding", () => {
    const actual = new Price(10, Currency.EUR).add(new Price(15, Currency.EUR));
    expect(actual.equal(new Price(10 + 15, Currency.EUR))).toBeTruthy();
  });

  test("times", () => {
    const actual = new Price(10, Currency.EUR).times(10);
    expect(actual.equal(new Price(10 * 10, Currency.EUR))).toBeTruthy();
  });
});
