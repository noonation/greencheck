import NextAuth from "next-auth";

import type GreencheckClaim from "./greencheck";
import { GreencheckClaimError } from "./greencheck";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: {
    //   /** The user's postal address. */
    //   address: string
    // }
    claims?: GreencheckClaim[];
    claimError?: GreencheckClaimError;
  }

  // attempting to define some properties through (playing with the typing)
  interface JWT {
    claims?: GreencheckClaim[];
    claimError?: GreencheckClaimError;
  }
}
