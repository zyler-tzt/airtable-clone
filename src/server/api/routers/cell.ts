import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const cellRouter = createTRPCRouter({
  updateCell: protectedProcedure
    .input(z.object({
        cellId: z.number(),
        value: z.union([z.string(), z.number()]),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: { id: input.cellId },
        data: {
          value: input.value.toString(),
        },
      });
    }),
    
});
