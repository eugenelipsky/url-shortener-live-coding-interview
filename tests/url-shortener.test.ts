import UrlShortener from "../src/url-shortener";

describe("UrlShortener", () => {
  let shortener: UrlShortener;

  beforeEach(() => {
    shortener = new UrlShortener();
    UrlShortener.reset();
  });

  test("should encode and decode correctly", () => {
    const original = "https://example.com";
    const short = shortener.encode(original);
    const decoded = shortener.decode(short);
    expect(decoded).toBe(original);
  });

  test("should return the same short URL for the same original URL", () => {
    const original = "https://example.com/same";
    const short1 = shortener.encode(original);
    const short2 = shortener.encode(original);
    expect(short1).toBe(short2);
  });

  test("should return different short URLs for different original URLs", () => {
    const original1 = "https://example.com/one";
    const original2 = "https://example.com/two";
    const short1 = shortener.encode(original1);
    const short2 = shortener.encode(original2);
    expect(short1).not.toBe(short2);
  });

  test("creates custom alias and allows decoding", () => {
    const original = "https://test.com";
    const short = shortener.encode(original);
    const custom = shortener.makeCustom(short, "myalias");
    expect(custom).toBe("http://sho.rt/myalias");
    expect(shortener.decode(custom)).toBe(original);
  });

  test("click counts increment correctly", () => {
    const original = "https://count.com";
    const short = shortener.encode(original);
    shortener.decode(short);
    shortener.decode(short);
    expect(shortener.getClickStats(short)).toBe(2);
  });

  // ==== Edge case tests ====

  test("encode throws on invalid long URL", () => {
    expect(() => shortener.encode("")).toThrow("Invalid long URL");
    expect(() => shortener.encode(null as any)).toThrow("Invalid long URL");
    expect(() => shortener.encode(undefined as any)).toThrow(
      "Invalid long URL"
    );
  });

  test("decode throws on invalid format and missing URL", () => {
    expect(() => shortener.decode("invalid-url")).toThrow(
      "Invalid short URL format"
    );
    expect(() => shortener.decode("http://sho.rt/unknownkey")).toThrow(
      "Short URL not found"
    );
    expect(() => shortener.decode("http://sho.rt/")).toThrow(
      "Short URL key is missing"
    );
  });

  test("makeCustom throws if original short URL does not exist", () => {
    expect(() =>
      shortener.makeCustom("http://sho.rt/nonexistent", "alias")
    ).toThrow("Original short URL does not exist");
  });

  test("makeCustom throws if alias already taken", () => {
    const original1 = "https://test1.com";
    const original2 = "https://test2.com";
    const short1 = shortener.encode(original1);
    const short2 = shortener.encode(original2);

    shortener.makeCustom(short1, "alias123");

    expect(() => shortener.makeCustom(short2, "alias123")).toThrow(
      "Custom alias already taken"
    );
  });

  test("makeCustom throws on invalid alias formats", () => {
    const original = "https://test.com";
    const short = shortener.encode(original);

    expect(() => shortener.makeCustom(short, "")).toThrow(
      "Invalid custom alias format"
    );
    expect(() => shortener.makeCustom(short, "invalid alias!")).toThrow(
      "Invalid custom alias format"
    );
    expect(() => shortener.makeCustom(short, "a".repeat(65))).toThrow(
      "Invalid custom alias format"
    );
  });

  test("getClickStats throws if short URL does not exist", () => {
    expect(() => shortener.getClickStats("http://sho.rt/unknown")).toThrow(
      "Short URL does not exist"
    );
  });
});
