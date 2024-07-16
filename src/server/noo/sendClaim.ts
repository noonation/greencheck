import { z } from "zod";
import { GREENCHECK_TOKEN } from "./constants";
import { getUrl } from "./transformers";
import { GreencheckErrorResponse } from "~/types/greencheck";

export const mock_data = {
  // from transmit-claim
  from_id: "Persons/da243e7c-0589-47c1-9c1c-4ffb2ce22398",
  to_id: "@0",
  type: "claim",
  service: "linkedin",
  claim: {
    username: "brad-degraf-4521",
    image:
      "https://media.licdn.com/dms/image/C5603AQENrEqXxptDNA/profile-displayphoto-shrink_100_100/0/1650198844275?e=1726704000&v=beta&t=OHFBh2m1ikpXPnNAR6MNeSsfJyc86Utv6LlcnQPqRtU",
    desc: "Trust Networks and Collective Decision-Making",
    fullname: "Brad deGraf",
  },
};

export const SendClaimInput = z.object({
  // gcid: z.string().optional(), // GCID of current session if known
  // node: z.object({}).optional(),
  from_id: z.string(),
  to_id: z.string(),
  type: z.string(), // .enum(["claim"]),
  service: z.string(), // eventual enum of linkedin, twitter, etc.
  claim: z.object({
    username: z.string(),
    image: z.string(),
    desc: z.string(),
    fullname: z.string(),
  }),
});

const SendClaimResponse = z.object({
  gcid: z.string().optional(), // GCID of current session if known
  node: z.object({}).optional(),
});

export type SendClaimInputType = z.infer<typeof SendClaimInput>;
export type SendClaimResponseType = z.infer<typeof SendClaimResponse>;

// ping noo-express server to check the claim:
export async function sendClaim(
  input: SendClaimInputType,
): Promise<SendClaimResponseType | GreencheckErrorResponse> {
  console.log(
    "SENDCLAIM token",
    GREENCHECK_TOKEN,
    "input",
    JSON.stringify(input),
  );
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
