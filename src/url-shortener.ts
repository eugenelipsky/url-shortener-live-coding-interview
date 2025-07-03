export default class UrlShortener {
  private static urlMap = new Map<string, string>();

  public encode(longUrl: string): void {}

  public decode(shortUrl: string): void {}

  public makeCustom(shortUrl: string, customAlias: string): void {}

  public getClickStats(shortUrl: string): void {}
}
