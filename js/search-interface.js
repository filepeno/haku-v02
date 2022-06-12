import { findAll } from "./full-search";
import { autoSuggest } from "./autosuggest";
import { initSearch } from "./init-search";
import { HTML } from "../main";

const site = {
  defaultSite: "knowit",
  customSite: "",
  siteToSearch: "",
  customDomain: "",
  defaultDomain: "",
};

window.addEventListener("load", init);

async function init() {
  HTML.input = document.querySelector("#search-input");
  HTML.suggestionsWrpr = document.querySelector(".suggestions-wrapper");
  HTML.site = document.querySelector(".site-to-search");
  HTML.switch = document.querySelector(".switch");
  HTML.switchInput = document.querySelector(".switch input");
  HTML.disclaimer = document.querySelector(".disclaimer");
  site.customSite = getCustomSite();
  if (site.customSite !== undefined) {
    site.siteToSearch = site.customSite;
    await setDomainVars();
    trackSwitchInteraction();
    HTML.switchInput.click();
    displaySwitch();
    hideDisclaimer();
  } else {
    site.siteToSearch = site.defaultSite;
    const result = await initSearch(site.siteToSearch);
    displayDomain(getDomainName(result));
  }
  trackSearchInputInteraction();
}

function getCustomSite() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  if (id !== null) {
    //set site name in local storage
    localStorage.setItem("haku_id", id);
    return id;
  } else {
    id = localStorage.getItem("haku_id");
    if (id !== null) {
      return id;
    }
  }
}

function getDomainName(result) {
  const fullUrl = result.hits.hits[0]._source.url;
  const clippedURl = fullUrl.substring(fullUrl.indexOf(".") + 1, fullUrl.length);
  const domain = clippedURl.substring([0], clippedURl.indexOf("/"));
  return domain;
}

function displaySwitch() {
  HTML.switch.classList.remove("hidden");
}

function hideDisclaimer() {
  HTML.disclaimer.classList.add("hidden");
}

function trackSearchInputInteraction() {
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
    autoSuggest(site.siteToSearch, HTML.input.value);
  };
}

async function setDomainVars() {
  //set custom and default domain vars
  const resultDefault = await initSearch(site.defaultSite);
  site.defaultDomain = getDomainName(resultDefault);

  const resultCustom = await initSearch(site.customSite);
  site.customDomain = getDomainName(resultCustom);
}

function trackSwitchInteraction() {
  HTML.switchInput.addEventListener("click", () => {
    if (HTML.switchInput.checked === true) {
      site.siteToSearch = site.customSite;
      displayDomain(site.customDomain);
    } else {
      site.siteToSearch = site.defaultSite;
      displayDomain(site.defaultDomain);
    }
  });
}

export function displayDomain(domain) {
  HTML.site.textContent = domain;
}

function handleRequest(q) {
  if (q) {
    findAll(site.siteToSearch, q, 1);
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
  document.querySelector(".results-wrapper .result-scope").classList.remove("hidden");
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
