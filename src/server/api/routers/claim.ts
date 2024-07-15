import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { ClaimCheckInput, checkClaim } from "~/server/noo/checkClaim";
import { sendClaim } from "~/server/noo/sendClaim";

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
    .mutation(async ({ input }) => await sendClaim()),
});
