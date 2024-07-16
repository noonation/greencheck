import { z } from "zod";
import { GreencheckClaim, GreencheckErrorResponse } from "~/types/greencheck";
import { GREENCHECK_TOKEN } from "./constants";
import { getUrl } from "./transformers";

// set up the data validation:
export const ClaimCheckInput = z.object({
  source: z.string().min(1), // github
  username: z.string(), // "the username attribute"
  id: z.string(), // "the user id from source"
  createIfNotExists: z.boolean().optional(),
});

// type safety:
export type ClaimCheckInputType = z.infer<typeof ClaimCheckInput>;

// ping noo-express server to check the claim:
export async function checkClaim(
  input: ClaimCheckInputType,
): Promise<GreencheckClaim | GreencheckErrorResponse> {
  console.log("token", GREENCHECK_TOKEN, "input", JSON.stringify(input));
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  const url = getUrl(`/greencheck/claim`);
  console.log("fetching", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: GREENCHECK_TOKEN,
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
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
  } catch (e) {
    console.log("caught fetch error", e);
    return { error: "fetch fail while checking claim", message: e };
  }
}
