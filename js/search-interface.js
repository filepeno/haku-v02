import { findAll } from "./full-search";
import { autoSuggest } from "./autosuggest";
import { initSearch } from "./init-search";

export const HTML = {};

window.addEventListener("load", init);

function init() {
  HTML.input = document.querySelector("#search-input");
  HTML.suggestionsWrpr = document.querySelector(".suggestions-wrapper");
  HTML.site = document.querySelector(".site-to-search");
  const defaultSite = "https://stromlin-es.test.headnet.dk/site-da-knowit/_search/template";
  initSearch(defaultSite);
  trackInteraction();
}

export function displayDomain(domain) {
  HTML.site.textContent = domain;
}

function trackInteraction() {
  trackReturn();
  /*   trackNextAndPrevBtn(); */
}

function trackReturn() {
  HTML.input.onkeydown = (e) => {
    //check if return key
    if (e.keyCode === 13) {
      e.preventDefault();
      handleRequest(HTML.input.value);
      blurInput();
      hideSuggestions();
    }
  };
  HTML.input.onkeyup = () => {
    autoSuggest(HTML.input.value);
  };
}

function handleRequest(q) {
  if (q) {
    findAll(q, 1);
  } else {
    displayResultFeedback(q);
  }
  clearResults();
}

export function displayResultFeedback(q, hits) {
  const el = document.querySelector(".result-feedback");
  el.querySelector("[data-query]").textContent = q;
  if (hits > 0) {
    el.querySelector("[data-hits]").textContent = hits;
  } else {
    el.querySelector("[data-hits]").textContent = "0";
  }
  el.classList.remove("hidden");
}

export function clearResults() {
  const parent = document.querySelector(".results-area");
  parent.innerHTML = "";
}

function blurInput() {
  HTML.input.blur();
}

export function displayScope(fromValue, toValue) {
  document.querySelector("[data-from]").textContent = fromValue;
  document.querySelector("[data-to]").textContent = toValue;
}

export function toggleSearchArea() {
  document.querySelector(".results-wrapper").classList.remove("hidden");
  document.querySelector(".hero").classList.add("search-active");
}

export function displaySuggestions() {
  console.log("display suggestions");
  HTML.suggestionsWrpr.classList.remove("hidden");
  HTML.input.classList.add("suggestions-active");
  window.addEventListener("click", checkIfSuggestion);
}

function checkIfSuggestion(e) {
  console.log(e.target);
  if (!e.target.classList.contains(".suggestion")) {
    hideSuggestions();
  }
}

export function hideSuggestions() {
  console.log("hide suggestions");
  HTML.suggestionsWrpr.classList.add("hidden");
  HTML.input.classList.remove("suggestions-active");
  window.removeEventListener("click", checkIfSuggestion);
}

export function clearSuggestions() {
  HTML.suggestionsWrpr.querySelector("ul").innerHTML = "";
}
