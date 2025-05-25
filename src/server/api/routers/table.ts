import { z } from "zod";
import { nanoid } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object(
      {
        name: z.string().min(1),
        baseId: z.number(),
      }),)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.create({
        data: {
          name: input.name,
          slug: nanoid(10),
          base: { connect: { id: input.baseId } },
          fields: {
            create: [
              {
                name: "Field 1",
                type: "text", 
              },
              {
                name: "Field 2",
                type: "number",
              },
            ],
          },
          rows: {
            create: [
              {}, {}, {},
            ]
          }
        },
      });

      return table;
    }),

  getTables: protectedProcedure
    .input(z.object({ baseId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findMany({
        where: { baseId: input.baseId },
      });
    }),

  getTableByTableId: protectedProcedure
    .input(z.object({ tableId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findUnique({
        where: { id: input.tableId },
      });
    }),

  getFields: protectedProcedure
  .input(z.object({ tableId: z.number() }))
  .query(({ ctx, input }) => {
    return ctx.db.field.findMany({
      where: { tableId: input.tableId },
      orderBy: { id: 'asc' },
    });
  }),

  getRowsWithCells: protectedProcedure
    .input(z.object({
      tableId: z.number(),
      offset: z.number().min(0).default(0),
      limit: z.number().min(1).max(100).default(30),
    }))
    .query(({ ctx, input }) => {
      return ctx.db.row.findMany({
        where: { tableId: input.tableId },
        orderBy: { id: 'asc' },
        skip: input.offset,
        take: input.limit,
        include: {
          cells: true,
        },
      });
    }),

  deleteTable: protectedProcedure
    .input(z.object({ tableId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.table.delete({
        where: { id: input.tableId },
      });
    }),

});
