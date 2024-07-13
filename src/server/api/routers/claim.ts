import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { checkClaim } from "~/server/noo/checkClaim";

export const claimRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  check: protectedProcedure
    .input(z.object({ source: z.string().min(1), id: z.string() }))
    .mutation(async ({ input }) => await checkClaim(input)),
});
