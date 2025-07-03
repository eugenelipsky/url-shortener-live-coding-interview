import UrlShortener from "./src/url-shortener";
(async () => {
  const shortener = new UrlShortener();

  const short = await shortener.encode("https://hello.com/something?is_new=true");
  console.log("Short URL:", short, "\n");

  const secondShort = await shortener.encode("https://hello.com/shopping?auth=false");
  console.log("Short URL:", secondShort, "\n");

  const sameShort = await shortener.encode("https://hello.com/something?is_new=true");
  console.log("Short URL (repeated):", sameShort, "\n");

  const decoded = await shortener.decode(short);
  console.log("Decoded URL:", decoded, "\n");

  const customShort = await shortener.makeCustom(short, "customAlias");
  console.log("Custom Short URL:", customShort, "\n");

  for (const _ of Array(5).keys()) {
    console.log("Click:", await shortener.decode(secondShort));
  }

  const stats = await shortener.getClickStats(secondShort);
  console.log("Click Stats:", stats, "\n");

  // Error handling
  try {
    await shortener.encode("");
  } catch (e) {
    console.error("Encode empty string error:", (e as Error).message);
  }

  try {
    await shortener.encode(null as any);
  } catch (e) {
    console.error("Encode null error:", (e as Error).message);
  }

  try {
    await shortener.decode("invalid-url");
  } catch (e) {
    console.error("Decode invalid format:", (e as Error).message);
  }

  try {
    await shortener.decode("http://sho.rt/unknownkey");
  } catch (e) {
    console.error("Decode unknown key:", (e as Error).message);
  }

  try {
    await shortener.makeCustom(customShort, "");
  } catch (e) {
    console.error("Empty alias:", (e as Error).message);
  }

  try {
    await shortener.makeCustom(customShort, "invalid alias!");
  } catch (e) {
    console.error("Invalid alias chars:", (e as Error).message);
  }

  try {
    await shortener.makeCustom("http://sho.rt/nonexistent", "alias");
  } catch (e) {
    console.error("Non-existent original short URL:", (e as Error).message);
  }

  try {
    await shortener.makeCustom(customShort, "customAlias");
  } catch (e) {
    console.error("Alias already taken:", (e as Error).message);
  }

  try {
    await shortener.getClickStats("http://sho.rt/unknown");
  } catch (e) {
    console.error("Click stats for unknown alias:", (e as Error).message);
  }
})();