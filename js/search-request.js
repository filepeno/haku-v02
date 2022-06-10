export default async function searchRequest(site, raw) {
  const defaultSite = "knowit";
  let siteToSearch = defaultSite;
  if (site != undefined || site != null) {
    siteToSearch = site;
  }
  const url = `https://stromlin-es.test.headnet.dk/site-da-${siteToSearch}/_search/template`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const res = await fetch(url, requestOptions);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
