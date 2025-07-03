import UrlShortener from "./src/url-shortener";

const shortener = new UrlShortener();

const short = shortener.encode("https://hello.com/something?is_new=true");
console.log("<shortener.encode call>: Making short URL");
console.log(`Short URL: ${short} \n`);

const secondShort = shortener.encode("https://hello.com/shopping?auth=false");
console.log("<shortener.encode call>: Making short URL for another long URL");
console.log(`Short URL: ${secondShort} \n`);

const sameShort = shortener.encode("https://hello.com/something?is_new=true");
console.log("<shortener.encode call>: Making short URL for the same long URL again");
console.log(`Short URL: ${sameShort} \n`);

const decoded = shortener.decode(short);
console.debug("<shortener.decode call>: Decoding short URL to original");
console.log(`Decoded URL: ${decoded} \n`);

const customShort = shortener.makeCustom(short, "customAlias");
console.log(`<shortener.makeCustom call>: Custom Short URL: ${customShort} \n`);

console.log("Getting click stats for custom alias with for of loop");
for (const _ of Array(5).keys()) {
  console.log("<shortener.decode call>: Click:", shortener.decode(secondShort));
}

const secondShortStats = shortener.getClickStats(secondShort);
console.log("<shortener.getClickStats call>: Click Stats for second short URL:", secondShortStats);


// 1. Encode invalid URLs
try {
  shortener.encode("");
} catch (e) {
  console.error("Encode empty string error:", (e as Error).message);
}
try {
  shortener.encode(null as any);
} catch (e) {
  console.error("Encode null error:", (e as Error).message);
}

// 2. Decode invalid short URL format
try {
  shortener.decode("invalid-url");
} catch (e) {
  console.error("Decode invalid URL format error:", (e as Error).message);
}

// 3. Decode non-existent short URL
try {
  shortener.decode("http://sho.rt/unknownkey");
} catch (e) {
  console.error("Decode unknown key error:", (e as Error).message);
}

// 4. Make custom alias with invalid alias
try {
  shortener.makeCustom(customShort, "");
} catch (e) {
  console.error("Make custom alias empty error:", (e as Error).message);
}
try {
  shortener.makeCustom(customShort, "invalid alias!");
} catch (e) {
  console.error("Make custom alias invalid chars error:", (e as Error).message);
}

// 5. Make custom alias when original short URL doesn't exist
try {
  shortener.makeCustom("http://sho.rt/nonexistent", "alias");
} catch (e) {
  console.error("Make custom alias non-existent original error:", (e as Error).message);
}

// 6. Make custom alias that is already taken
try {
  shortener.makeCustom(customShort, "customAlias");
} catch (e) {
  console.error("Make custom alias already taken error:", (e as Error).message);
}

// 7. Get click stats for unknown short URL
try {
  shortener.getClickStats("http://sho.rt/unknown");
} catch (e) {
  console.error("Get click stats unknown key error:", (e as Error).message);
}