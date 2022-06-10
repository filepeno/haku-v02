import searchRequest from "./search-request";

export async function initSearch(customSite) {
  const raw = JSON.stringify({
    id: "fullsearch",
  });

  const result = await searchRequest(customSite, raw);
  return result;
}
