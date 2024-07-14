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
  console.log('token', GREENCHECK_TOKEN)
  if (!GREENCHECK_TOKEN) {
    return {
      error: "preflight check failed",
      message: "missing greencheck server token",
    };
  }

  const url = getUrl(`/greencheck/claim/login/github/${input.id}`);
  console.log('fetching', url)
  const response = await fetch(url, {
    headers: {
      authorization: GREENCHECK_TOKEN,
    },
  });
  if (response.ok) {
    const data = await response.json();
    console.log('data', response.ok, data)
    return data;
  } else {
    console.log('ERROR', response)
    const errorText = await response.text();
    return { error: "something failed", message: errorText };
  }
}
