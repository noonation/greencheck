import { Account, Profile } from "next-auth";

import { NOO_EXPRESS_SERVER } from "./constants";

export function getClaimIdFromProfile(providerName: string, profile: Profile) {
  switch (providerName) {
    case "github":
      // TODO: find the right type(s) so we don't need these ignore tags
      // @ts-ignore, profile returned from github has "login" as username
      return profile.login;
  }

  console.log("unknown provider, not sure how to get the username");

  return "";
}

export function getProviderKeyFromProvider(providerName: string) {
  switch (providerName) {
    case "github":
      return "login";
  }

  console.log("unknown provider, not sure how to get the provider key");

  return "";
}

export function getUserIdFromAccount(providerName: string, account: Account) {
  switch (providerName) {
    case "github":
      return account.id as string;
  }

  console.log("unknown provider, not sure how to get the account user id");

  return "";
}

export const getUrl = (path: string) => `${NOO_EXPRESS_SERVER}${path}`;
