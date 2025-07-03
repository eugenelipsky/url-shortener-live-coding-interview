const BASE_URL = "http://sho.rt/";
const SHORT_KEY_LENGTH = 6;

type ShortKey = string;
type LongUrl = string;
type CustomAlias = string;

interface DumpState {
  urlMap: [ShortKey, LongUrl][];
  stats: [ShortKey, number][];
}

export interface IUrlShortener {
  encode(longUrl: LongUrl): string;
  decode(shortUrl: string): LongUrl;
  makeCustom(shortUrl: string, customAlias: CustomAlias): string;
  getClickStats(shortUrl: string): number;
}

export default class UrlShortener implements IUrlShortener {
  private static urlMap = new Map<ShortKey, LongUrl>();
  private static reverseMap = new Map<LongUrl, ShortKey>();
  private static stats = new Map<ShortKey, number>();

  public encode(longUrl: LongUrl): string {
    if (!longUrl || typeof longUrl !== "string") {
      throw new Error("Invalid long URL");
    }
    const existingShort = UrlShortener.reverseMap.get(longUrl);
    if (existingShort) {
      return BASE_URL + existingShort;
    }

    const shortKey = UrlShortener.generateShortKey();
    UrlShortener.urlMap.set(shortKey, longUrl);
    UrlShortener.reverseMap.set(longUrl, shortKey);
    UrlShortener.stats.set(shortKey, 0);

    return BASE_URL + shortKey;
  }

  public decode(shortUrl: string): LongUrl {
    const key = UrlShortener.extractKeyFromShortUrl(shortUrl);
    const original = UrlShortener.urlMap.get(key);
    if (!original) {
      throw new Error("Short URL not found");
    }

    const clicks = UrlShortener.stats.get(key) ?? 0;
    UrlShortener.stats.set(key, clicks + 1);
    return original;
  }

  public makeCustom(shortUrl: string, customAlias: CustomAlias): string {
    if (
      !customAlias ||
      typeof customAlias !== "string" ||
      !/^[a-zA-Z0-9_-]{1,64}$/.test(customAlias)
    ) {
      throw new Error(
        "Invalid custom alias format: only alphanumeric, underscore, hyphen allowed (1-64 chars)"
      );
    }

    const oldKey = UrlShortener.extractKeyFromShortUrl(shortUrl);
    const original = UrlShortener.urlMap.get(oldKey);

    if (!original) {
      throw new Error("Original short URL does not exist");
    }

    if (UrlShortener.urlMap.has(customAlias)) {
      throw new Error("Custom alias already taken");
    }

    UrlShortener.urlMap.delete(oldKey);
    UrlShortener.urlMap.set(customAlias, original);
    UrlShortener.reverseMap.set(original, customAlias);

    const stats = UrlShortener.stats.get(oldKey) ?? 0;
    UrlShortener.stats.set(customAlias, stats);
    UrlShortener.stats.delete(oldKey);

    return BASE_URL + customAlias;
  }

  public getClickStats(shortUrl: string): number {
    const key = UrlShortener.extractKeyFromShortUrl(shortUrl);
    if (!UrlShortener.urlMap.has(key)) {
      throw new Error("Short URL does not exist");
    }
    return UrlShortener.stats.get(key) ?? 0;
  }

  public static reset(): void {
    this.urlMap.clear();
    this.reverseMap.clear();
    this.stats.clear();
  }

  public static dumpState(): DumpState {
    return {
      urlMap: Array.from(this.urlMap.entries()),
      stats: Array.from(this.stats.entries()),
    };
  }

  private static generateShortKey(): ShortKey {
    let key: ShortKey;
    do {
      key = Math.random()
        .toString(36)
        .substring(2, 2 + SHORT_KEY_LENGTH);
    } while (this.urlMap.has(key));
    return key;
  }

  private static extractKeyFromShortUrl(shortUrl: string): ShortKey {
    if (!shortUrl.startsWith(BASE_URL)) {
      throw new Error("Invalid short URL format");
    }
    const key = shortUrl.slice(BASE_URL.length);
    if (!key) {
      throw new Error("Short URL key is missing");
    }
    return key;
  }
}
