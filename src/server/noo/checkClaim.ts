import { z } from "zod";
import { GreencheckClaim, GreencheckClaimError } from "~/types/greencheck";

// ENV this eventually:
const NOO_EXPRESS_SERVER = "http://localhost:3001";
const GREENCHECK_TOKEN = process.env.GREENCHECK_SERVER_TOKEN;

const getUrl = (path: string) => `${NOO_EXPRESS_SERVER}${path}`;

// set up the data validation:
const ClaimCheckInput = z.object({ source: z.string().min(1), id: z.string() });
type ClaimCheckInput = z.infer<typeof ClaimCheckInput>;

// ping noo-express server to check the claim:
export async function checkClaim(
  input: ClaimCheckInput,
): Promise<GreencheckClaim | GreencheckClaimError> {
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  const url = getUrl(`/greencheck/claim/${input.source}/${input.id}`);
  const response = await fetch(url, {
    headers: {
      authorization: GREENCHECK_TOKEN,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorText = await response.text();
    return { error: "something failed", message: errorText };
  }
}
