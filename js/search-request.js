export default async function searchRequest(raw) {
  console.log(raw);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const res = await fetch("https://stromlin-es.test.headnet.dk/site-da-knowit/_search/template", requestOptions);
    return await res.json();
  } catch (error) {
    console.log(error);
  }

  /*     .catch((error) => console.log("error", error)); */
}
