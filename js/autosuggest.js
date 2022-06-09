import { clearSuggestions, displaySuggestions, hideSuggestions } from "./search-interface";
import searchRequest from "./search-request";

export async function autoSuggest(customSite, q) {
  if (q.length > 1) {
    const raw = JSON.stringify({
      id: "autosuggest",
      params: {
        query_string: q,
      },
    });

    cleanResults(await searchRequest(customSite, raw));
  } else {
    hideSuggestions();
  }
}

function cleanResults(result) {
  const hits = result.hits.hits;
  const totalHits = hits.length;
  if (totalHits > 0) {
    clearSuggestions();
    hits.forEach((hit) => {
      appendSuggestion(hit);
    });
    displaySuggestions();
  } else {
    clearSuggestions();
    hideSuggestions();
  }
}

function appendSuggestion(hit) {
  const parent = document.querySelector(".suggestions-wrapper ul");
  const template = document.querySelector("#autosuggest-template").content;
  const clone = template.cloneNode(true);
  const link = clone.querySelector("a");
  link.textContent = hit._source.title;
  link.href = hit._source.url;
  parent.appendChild(clone);
}
