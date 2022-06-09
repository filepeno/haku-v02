export default async function searchRequest(customSite, raw) {
  const defaultSite = "knowit";
  let site = defaultSite;
  if (customSite != null) {
    site = customSite;
  }
  console.log("site", site);
  const url = `https://stromlin-es.test.headnet.dk/site-da-${site}/_search/template`;
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
