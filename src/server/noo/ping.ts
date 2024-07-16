import { z } from "zod";
import { GreencheckErrorResponse } from "~/types/greencheck";
import { GREENCHECK_TOKEN } from "./constants";
import { getUrl } from "./transformers";

// set up the data validation:
export const PingInput = z.object({
  reflect: z.string().optional(), // passing a string in reflect, will come back in the response data
});

// type safety:
export type PingInputType = z.infer<typeof PingInput>;

const PingResponse = z.object({
  hai: z.string(),
  reflect: z.string().optional(),
});

export type PingResponseType = z.infer<typeof PingInput>;

// ping noo-express server to check the claim:
export async function sendPing(
  input: PingInputType,
): Promise<PingResponseType | GreencheckErrorResponse> {
  console.log("token", GREENCHECK_TOKEN, "input", JSON.stringify(input));
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  let url = getUrl(`/greencheck/ping`);
  if (input.reflect) {
    url += `?reflect=${input.reflect}`;
  }

  console.log("fetching", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: GREENCHECK_TOKEN,
        "content-type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("data", response.ok, data);
      return data;
    } else {
      console.log("ERROR", response);
      const error = await response.json();
      return { error: "something failed", message: error.error };
    }
  } catch (e) {
    console.log("caught fetch error", e);
    return { error: "fetch fail while checking claim", message: e as string };
  }
}
