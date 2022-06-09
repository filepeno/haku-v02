import { displayDomain } from "./search-interface";
import searchRequest from "./search-request";

export async function initSearch(customSite) {
  const raw = JSON.stringify({
    id: "fullsearch",
  });

  const result = await searchRequest(customSite, raw);
  return result;
}

export function getDomainName(result) {
  const fullUrl = result.hits.hits[0]._source.url;
  const clippedURl = fullUrl.substring(fullUrl.indexOf(".") + 1, fullUrl.length);
  const domain = clippedURl.substring([0], clippedURl.indexOf("/"));
  return domain;
}
