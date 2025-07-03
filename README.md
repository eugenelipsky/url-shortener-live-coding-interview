# URL Shortener – Live Coding Task

## Goal

Implement a simple in-memory URL shortener service in TypeScript by completing the `UrlShortener` class in the `src/url-shortener.ts` file. The class should support encoding and decoding URLs, custom aliases, and basic analytics.

This exercise evaluates your ability to design clean APIs, use appropriate data structures, and write maintainable and testable code.

---

## Requirements

The application should be fully console-based. You need to simulate user actions in the `index.ts` file.
For example, calling `shortener.decode` simulates a user opening a short link.

Complete the following methods in the `UrlShortener` class:

1.  **`encode(longUrl: string): string`**

    Converts a long URL into a unique shortened version. If the same URL is encoded multiple times, return the same short URL each time.

    ```ts
    shortener.encode("https://hello.com/something?is_new=true");
    // → "http://sho.rt/2irbz6"
    ```

2.  **`decode(shortUrl: string): string`**

    Retrieves the original long URL from a shortened one. If the short URL is unknown, throw an error.

    ```ts
    shortener.decode("http://sho.rt/2irbz6");
    // → "https://hello.com/something?is_new=true)"
    ```

3.  **`makeCustom(shortUrl: string, customAlias: string): string`**

    Allows the user to replace a system-generated short URL with a custom alias.

    ```ts
    shortener.makeCustom("http://sho.rt/2irbz6", "customAlias");
    // → "http://sho.rt/customAlias"
    ```

    - If the alias is already in use, throw an error.

4.  **`getClickStats(shortUrl: string): number` (Optional)**

    ```ts
    shortener.decode("http://sho.rt/customAlias");
    shortener.decode("http://sho.rt/customAlias");

    shortener.getClickStats("http://sho.rt/customAlias");
    // → 2
    ```

---

## Database table schema

```
┌──────────────┬──────────────┬────────────────────────────────────────────┐
│ Column       │ Type         │ Description                                │
├──────────────┼──────────────┼────────────────────────────────────────────┤
│ id           │ SERIAL       │ Primary key (auto-incrementing)            │
│ short_key    │ VARCHAR(64)  │ Unique short alias for the long URL        │
│ long_url     │ TEXT         │ Original full-length URL                   │
│ click_count  │ INTEGER      │ Number of times the short URL was accessed │
└──────────────┴──────────────┴────────────────────────────────────────────┘
```

## Tests

Basic tests are provided in `tests/url-shortener.test.ts`. Your task is to implement the class until all tests pass.
