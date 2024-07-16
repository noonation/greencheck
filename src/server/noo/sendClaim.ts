import { z } from "zod";
import { GreencheckClaim } from "~/types/greencheck";

// ENV this eventually:
const NOO_EXPRESS_SERVER = "http://localhost:3001";
const GREENCHECK_TOKEN = process.env.GREENCHECK_SERVER_TOKEN;

const getUrl = (path: string) => `${NOO_EXPRESS_SERVER}${path}`;

// ping noo-express server to check the claim:
export async function sendClaim(): Promise<GreencheckClaim> {
  console.log('SENDCLAIM')
  console.log("token send", GREENCHECK_TOKEN, "input", 'foo');
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  const url = getUrl(`/greencheck/send-claim`);
  console.log("fetching sendclaim", url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: GREENCHECK_TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (response.ok) {
    const data = await response.json();
    console.log("data", response.ok, data);
    return data.response;
  } else {
    console.log("ERROR", response);
    const errorText = await response.text();
    return { error: "something failed", message: errorText };
  }
}
