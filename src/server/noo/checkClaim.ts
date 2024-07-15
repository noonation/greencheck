import { z } from "zod";
import { GreencheckClaim, GreencheckClaimError } from "~/types/greencheck";

// ENV this eventually:
const NOO_EXPRESS_SERVER = "http://localhost:3001";
const GREENCHECK_TOKEN = process.env.GREENCHECK_SERVER_TOKEN;

const getUrl = (path: string) => `${NOO_EXPRESS_SERVER}${path}`;

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
): Promise<GreencheckClaim | GreencheckClaimError> {
  console.log("token", GREENCHECK_TOKEN, "input", JSON.stringify(input));
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  const url = getUrl(`/greencheck/claim`);
  console.log("fetching", url);
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
}
