import { clearSuggestions, displaySuggestions, hideSuggestions } from "./search-interface";

export function autoSuggest(q) {
  if (q.length > 1) {
    console.log("query", q);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: "autosuggest",
      params: {
        query_string: q,
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://stromlin-es.test.headnet.dk/site-da-knowit/_search/template", requestOptions)
      .then((response) => response.json())
      .then((result) => cleanResults(result));
    /* .catch((error) => console.log("error", error)); */
  } else {
    hideSuggestions();
  }
}

function cleanResults(result) {
  const hits = result.hits.hits;
  console.log(hits);
  const totalHits = hits.length;
  console.log("total hits:", totalHits);
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
  clone.querySelector("a").textContent = hit._source.title;
  parent.appendChild(clone);
}
