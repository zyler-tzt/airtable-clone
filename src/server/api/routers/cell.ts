import { z } from "zod";

interface Cell {
  value: string,
  fieldId: number,
  rowId: number,
}

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

    createCell: protectedProcedure
    .input(z.object({
      value: z.union([z.string(), z.number()]),
      fieldId: z.number(),
      rowId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.create({
        data: {
          value: input.value.toString(),
          field: { connect: { id: input.fieldId } },
          row: { connect: { id: input.rowId } },
        },
      });
    }),

    deleteCell: protectedProcedure
    .input(z.object({
      cellId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.delete({
        where: {
          id: input.cellId,
        },
      });
    }),

    create1kRows: protectedProcedure
    .input(z.object({
      tableId: z.number(),
      fieldInfo: z.array(
        z.object({
          fieldId: z.number(),
          fieldType: z.string(), 
        }),
      )
    }))
    .mutation(async ({ ctx, input }) => {
      const cellsArray: Cell[] = []
      for (let i = 0; i < 1000; i++) {
        const row = await ctx.db.row.create({
          data: {
            table: { connect: { id: input.tableId } },
          },
        });
        for (const field of input.fieldInfo) {
            cellsArray.push({
            value: "1",
            fieldId: field.fieldId,
            rowId: row.id,
          })
        }
      }

      return ctx.db.cell.createMany({
        data: cellsArray,
      });
    }),
});
