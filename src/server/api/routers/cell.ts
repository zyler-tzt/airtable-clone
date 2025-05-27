import { z } from "zod";
import { faker } from '@faker-js/faker';

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
        fieldId: z.number(),
        rowId: z.number(),
        value: z.union([z.string(), z.number()]),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: { 
          fieldId_rowId: {
            fieldId: input.fieldId,
            rowId: input.rowId,
          }
        },
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
    fieldId: z.number(),
    rowId: z.number(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.cell.delete({
      where: {
        fieldId_rowId: {
          fieldId: input.fieldId,
          rowId: input.rowId,
        }
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
    const rowsData = Array.from({ length: 100000 }, () => ({
      tableId: input.tableId,
    }));

    await ctx.db.row.createMany({
      data: rowsData,
    });

    const rows = await ctx.db.row.findMany({
      where: { tableId: input.tableId },
      orderBy: { id: "desc" },
    });


    const cellsArray: Cell[] = rows.flatMap((row) =>
    input.fieldInfo.map((field) => ({
      value:
        field.fieldType === "text"
          ? faker.person.firstName()
          : faker.phone.number(),
      fieldId: field.fieldId,
      rowId: row.id,
    }))
  );


    return ctx.db.cell.createMany({
      data: cellsArray,
    });
  }),
});
