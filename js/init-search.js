import { displayDomain } from "./search-interface";

export function initSearch(customSite) {
  let site = "knowit";
  if (customSite != null) {
    site = customSite;
  }
  const url = `https://stromlin-es.test.headnet.dk/site-da-${site}/_search/template`;
  console.log(url);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    id: "fullsearch",
    /* "params": {
    "include_facets": true
  } */
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return getSiteToSearch(result);
    });
  /*   .catch(error => console.log('error', error)); */
}

function getSiteToSearch(result) {
  const fullUrl = result.hits.hits[0]._source.url;
  const clippedURl = fullUrl.substring(fullUrl.indexOf(".") + 1, fullUrl.length);
  const domain = clippedURl.substring([0], clippedURl.indexOf("/"));
  displayDomain(domain);
}
