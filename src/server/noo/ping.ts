import { z } from "zod";
import { GreencheckErrorResponse } from "~/types/greencheck";
import { GREENCHECK_TOKEN } from "./constants";
import { getUrl } from "./transformers";

export const mock_data = {
  // from transmit-claim
  from_id: "Persons/da243e7c-0589-47c1-9c1c-4ffb2ce22398",
  to_id: "@0",
  type: "claim",
  target_data: {
      linkedin: {
          username: "brad-degraf-4521",
          image: "https://media.licdn.com/dms/image/C5603AQENrEqXxptDNA/profile-displayphoto-shrink_100_100/0/1650198844275?e=1726704000&v=beta&t=OHFBh2m1ikpXPnNAR6MNeSsfJyc86Utv6LlcnQPqRtU",
          desc: "Trust Networks and Collective Decision-Making",
          fullname: "Brad deGraf"
      }
  }
};

// set up the data validation:
export const PingInput = z.object({
  reflect: z.string().optional(), // passing a string in reflect, will come back in the response data
});
export const SendClaimInput = z.object({
  gcid: z.string().optional(), // GCID of current session if known
  node: z.object({}).optional()
});

// type safety:
export type PingInputType = z.infer<typeof PingInput>;
export type SendClaimInputType = z.infer<typeof SendClaimInput>;

const PingResponse = z.object({
  hai: z.string(),
  reflect: z.string().optional(),
});
const SendClaimResponse = z.object({
  gcid: z.string().optional(), // GCID of current session if known
  node: z.object({}).optional()
});

export type PingResponseType = z.infer<typeof PingInput>;
export type SendClaimResponseType = z.infer<typeof SendClaimInput>;

// ping noo-express server to check the claim:
export async function sendPing(
  input: PingInputType,
): Promise<PingResponseType | GreencheckErrorResponse> {
  console.log("PING token", GREENCHECK_TOKEN, "input", JSON.stringify(input));
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

// send a claim:
export async function sendSendClaim(
  input: SendClaimInputType,
): Promise<SendClaimResponseType| GreencheckErrorResponse> {
  console.log("SENDCLAIM token", GREENCHECK_TOKEN, "input", JSON.stringify(input));
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }
  let url = getUrl(`/greencheck/send-claim`);

  console.log("fetching", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: GREENCHECK_TOKEN,
        "content-type": "application/json",
      },
      body: JSON.stringify(mock_data),
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
