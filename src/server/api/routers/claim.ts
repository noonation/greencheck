import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { ClaimCheckInput, checkClaim } from "~/server/noo/checkClaim";
// import { sendClaim } from "~/server/noo/sendClaim"; // probably delete this, doing thru trpc now

export const claimRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  check: protectedProcedure
    .input(ClaimCheckInput)
    .mutation(async ({ input }) => await checkClaim(input)),
/*   sendClaim: protectedProcedure
    .input(ClaimCheckInput)
    .mutation(async ({ input }) => await sendClaim(input)), */
});
