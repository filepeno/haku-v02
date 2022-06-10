import searchRequest from "./search-request";
import { displayResultFeedback, displayScope, toggleSearchArea } from "./search-interface";
import { initPagination } from "./pagination";

//make not-global
let q;
let currentScope;
const size = 5;
const maxPages = 10;
let totalHits;
let offset;
//

export async function findAll(site, query, scope) {
  q = query;
  currentScope = scope;
  offset = calculateOffset();

  const raw = JSON.stringify({
    id: "fullsearch",
    params: {
      include_facets: true,
      query_string: q,
      size: size,
      from: offset,
    },
  });
  cleanResults(await searchRequest(site, raw), site);
}

function calculateOffset() {
  return size * currentScope - size;
}

function calculateScope() {
  let from;
  let to;
  //calculate from-value
  if (totalHits === 0) {
    from = 0;
  } else {
    from = offset + 1;
  }
  //calculate to-value
  if (totalHits < offset + size) {
    to = totalHits;
  } else {
    to = offset + size;
  }
  displayScope(from, to);
}

function cleanResults(result, site) {
  console.log("result", result);
  const hits = result.hits;
  const content = hits.hits;
  totalHits = hits.total.value;
  if (content.length > 0) {
    displayResults(content);
    toggleSearchArea();
  }
  //if first search
  if (currentScope === 1) {
    displayResultFeedback(q, totalHits);
    initPagination(q, totalHits, size, maxPages, site);
  }
  calculateScope(offset, size);
}

function displayResults(hits) {
  hits.forEach((hit) => {
    appendResult(hit);
  });
}

function appendResult(hit) {
  const parent = document.querySelector(".results-area");
  const template = document.querySelector("#result-template").content;
  const clone = template.cloneNode(true);
  const anchor = clone.querySelector("a");
  const date = clone.querySelector(".date");
  const title = clone.querySelector(".result-title");
  const excerpt1 = clone.querySelector(".excerpt-1");
  const excerpt2 = clone.querySelector(".excerpt-2");

  anchor.href = hit._source.url;
  date.textContent = hit._source.date_published;

  if (hit.highlight.title) {
    title.innerHTML = hit.highlight.title;
  } else {
    title.innerHTML = hit._source.title;
  }
  if (hit.highlight.body) {
    excerpt1.innerHTML = hit.highlight.body[0];

    if (hit.highlight.body[1]) {
      excerpt2.innerHTML = hit.highlight.body[1] + "...";
    }
  } else if (hit.highlight.description) {
    excerpt1.innerHTML = hit.highlight.description[0];
  }

  parent.appendChild(clone);
}
