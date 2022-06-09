import { findAll } from "./full-search";
import { autoSuggest } from "./autosuggest";
import { getDomainName, initSearch } from "./init-search";
import { HTML } from "../main";
import searchRequest from "./search-request";

window.addEventListener("load", init);

let customSite;

async function init() {
  HTML.input = document.querySelector("#search-input");
  HTML.suggestionsWrpr = document.querySelector(".suggestions-wrapper");
  HTML.site = document.querySelector(".site-to-search");
  HTML.switch = document.querySelector(".switch");
  HTML.switchInput = document.querySelector(".switch input");
  getCustomSite();
  const result = await initSearch(customSite);
  if (customSite !== null) {
    changeSwitchDisplay(true);
  }
  trackSwitchInteraction();
  displayDomain(getDomainName(result));
  trackInteraction();
}

function getCustomSite() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id != null) {
    customSite = id;
    //set site name in local storage
    localStorage.setItem("site_id", customSite);
  } else {
    customSite = localStorage.getItem("site_id");
  }
}

async function changeSwitchDisplay(checked) {
  const resultDefault = await initSearch(null);
  const resultCustom = await initSearch("version2");
  if (checked) {
    HTML.switchInput.checked = true;
    HTML.switch.querySelector(".label-text em").textContent = getDomainName(resultDefault);
    displayDomain(getDomainName(resultCustom));
  } else {
    HTML.switch.querySelector(".label-text em").textContent = getDomainName(resultCustom);
    displayDomain(getDomainName(resultDefault));
  }
}

async function trackSwitchInteraction() {
  console.log(HTML.switchInput.checked);
  HTML.switchInput.addEventListener("click", () => {
    if (HTML.switchInput.checked === true) {
      changeSwitchDisplay(true);
    } else {
      changeSwitchDisplay(false);
    }
  });
}

export function displayDomain(domain) {
  HTML.site.textContent = domain;
}

function trackInteraction() {
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
    autoSuggest(customSite, HTML.input.value);
  };
}

function handleRequest(q) {
  if (q) {
    findAll(customSite, q, 1);
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
  HTML.suggestionsWrpr.classList.remove("hidden");
  HTML.input.classList.add("suggestions-active");
  window.addEventListener("click", checkIfSuggestion);
}

function checkIfSuggestion(e) {
  if (!e.target.classList.contains(".suggestion")) {
    hideSuggestions();
  }
}

export function hideSuggestions() {
  HTML.suggestionsWrpr.classList.add("hidden");
  HTML.input.classList.remove("suggestions-active");
  window.removeEventListener("click", checkIfSuggestion);
}

export function clearSuggestions() {
  HTML.suggestionsWrpr.querySelector("ul").innerHTML = "";
}
