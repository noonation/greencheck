import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedinProvider from "next-auth/providers/linkedin";

import { env } from "~/env";
import {
  getProviderKeyFromProvider,
  getClaimIdFromProfile,
  getUserIdFromAccount,
} from "./noo/transformers";
import { checkClaim } from "./noo/checkClaim";
import { GreencheckClaim, GreencheckClaimError } from "~/types/greencheck";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    /**
     *
     * this signIn function is where we would accept the inbound completed signIn info
     * and ping noo-express to upsert the user
     *
     * upon return from noo-express, ok create a session and continue
     *
     * if session already created, we're just adding another credential to the logged-in user
     */
    async signIn({ user, account, profile, email, credentials }) {
      if (!account?.provider) {
        console.log("failed to sign in, no provider returned");
        return false;
      }
      if (!profile) {
        console.log("failed to sign in, no profile returned");
        return false;
      }
      console.log(
        "just signed in from: ",
        account.provider,
        account,
        user,
        profile,
      );
      const claimSource = `${account.provider}.${getProviderKeyFromProvider(account.provider)}`;
      const claimId = getClaimIdFromProfile(account.provider, profile);

      return !!(claimSource && claimId);
    },
    async jwt(params) {
      const { token, trigger } = params;
      if (trigger === "signIn") {
        const { account, profile } = params;
        console.log("JWT signing", account, profile);
        if (account && profile) {
          const username = getClaimIdFromProfile(account.provider, profile);
          const id = getUserIdFromAccount(account.provider, account);

          try {
            const claimCheck = await checkClaim({
              source: account.provider,
              username,
              id,
              createIfNotExists: true,
            });
            console.log("got a claimCheck back");
            console.log(claimCheck);

            if (claimCheck) {
              if (claimCheck.error) {
                token.claimError = claimCheck;
              } else {
                token.claims = [claimCheck];
              }
            } else {
              console.log(
                "nothing returned??? guess not found, need Create If Not Exists now",
              );
              token.claimError = {
                error: "claim check failed",
                message: "no results",
              };
            }

            console.log("token claims", typeof token, token.claims);
          } catch (error) {
            console.log("error checking the claim with noo server");
            console.log(error);
          }
        }
      }
      // return the token
      console.log("token", token);
      return token;
    },
    // @ts-ignore, this is correct function name and object destructure
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      if (token.claims) {
        session.claims = (token.claims || []) as GreencheckClaim[];
      } else if (token.claimError) {
        session.claimError = token.claimError as GreencheckClaimError;
      }
      return session;
    },
  },
  // this is how we define pages for making custom UI for next-auth signin, handling etc
  // pages: {
  //   signIn: "/auth/claim-service",
  // },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
    LinkedinProvider({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
