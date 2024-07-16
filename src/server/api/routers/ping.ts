// import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { PingInput, sendPing } from "~/server/noo/ping";

export const pingRouter = createTRPCRouter({
  sendPing: publicProcedure
    .input(PingInput)
    .mutation(async ({ input }) => await sendPing(input)),
});
