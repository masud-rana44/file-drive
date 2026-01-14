import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://loyal-parrot-72.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
