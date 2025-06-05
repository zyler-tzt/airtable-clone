import { z } from "zod";
import { faker } from "@faker-js/faker";

interface Cell {
  value: string;
  fieldId: number;
  rowId: number;
}

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const cellRouter = createTRPCRouter({
  updateCell: protectedProcedure
    .input(
      z.object({
        fieldId: z.number(),
        rowId: z.number(),
        value: z.union([z.string(), z.number()]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: {
          fieldId_rowId: {
            fieldId: input.fieldId,
            rowId: input.rowId,
          },
        },
        data: {
          value: input.value.toString(),
        },
      });
    }),

  createCell: protectedProcedure
    .input(
      z.object({
        value: z.union([z.string(), z.number()]),
        fieldId: z.number(),
        rowId: z.number(),
      }),
    )
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
    .input(
      z.object({
        fieldId: z.number(),
        rowId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.delete({
        where: {
          fieldId_rowId: {
            fieldId: input.fieldId,
            rowId: input.rowId,
          },
        },
      });
    }),

  create1kRows: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
        fieldInfo: z.array(
          z.object({
            fieldId: z.number(),
            fieldType: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ROW_TO_CREATE = 10000;
      const rowsData = Array.from({ length: ROW_TO_CREATE }, () => ({
        tableId: input.tableId,
      }));

      await ctx.db.row.createMany({
        data: rowsData,
      });

      const rows = await ctx.db.row.findMany({
        where: { tableId: input.tableId },
        orderBy: { id: "desc" },
        take: ROW_TO_CREATE,
      });

      const cellsArray: Cell[] = rows.flatMap((row) =>
        input.fieldInfo.map((field) => ({
          value:
            field.fieldType === "text"
              ? faker.person.firstName()
              : faker.number.int().toString(),
          fieldId: field.fieldId,
          rowId: row.id,
        })),
      );

      return ctx.db.cell.createMany({
        data: cellsArray,
      });
    }),

  infiniteRows: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
        viewId: z.number(),
        searchInput: z.string(),
        cursor: z.number().default(0),
        limit: z.number().optional().default(1000),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sortings = await ctx.db.sorting.findMany({
        where: { viewId: input.viewId },
        orderBy: { id: "asc" },
        include: {
          field: { select: { type: true } },
        },
      });

      const filters = await ctx.db.filter.findMany({
        where: { viewId: input.viewId },
        include: {
          field: true,
        },
      });

      const sortingSQL = sortings.map((sort, index) => {
        const cellAlias = `cell_${index}`;
        return {
          join: `LEFT JOIN "Cell" AS ${cellAlias} ON "Row".id = ${cellAlias}."rowId" AND ${cellAlias}."fieldId" = ${sort.fieldId}`,
          orderBy:
            sort.field.type === "number"
              ? `CAST(${cellAlias}.value AS NUMERIC) ${sort.order.toUpperCase()}`
              : `LOWER(${cellAlias}.value) ${sort.order.toUpperCase()}`,
        };
      });

      const joins = sortingSQL.map((sort) => sort.join).join(" ");
      const orderBy = sortingSQL.map((sort) => sort.orderBy).join(", ");
      const finalOrderBy = orderBy
        ? `${orderBy}, "Row".id ASC`
        : '"Row".id ASC';

      const finalQuery = `
      SELECT "Row".id
      FROM "Row"
      ${joins}
      WHERE "Row"."tableId" = ${input.tableId}
      ORDER BY ${finalOrderBy}
      LIMIT ${input.limit + 1}
      OFFSET ${input.cursor}
    `;

      const sortedRowIds =
        await ctx.db.$queryRawUnsafe<Array<{ id: number }>>(finalQuery);

      const hasNextPage = sortedRowIds.length > input.limit;
      const rowsToRet = hasNextPage ? sortedRowIds.slice(0, -1) : sortedRowIds;
      const nextCursor = hasNextPage ? input.cursor + input.limit : null;

      const rows = await ctx.db.row.findMany({
        where: {
          id: { in: rowsToRet.map((row) => row.id) },
        },
        include: {
          cells: true,
        },
      });

      const sortedRows = rowsToRet.map(
        (sortedRow) => rows.find((row) => row.id === sortedRow.id)!,
      );

      const filteredRows = sortedRows.filter((row) => {
        return filters.every((filter) => {
          const cell = row.cells.find((c) => c.fieldId === filter.fieldId);
          let value
          if (cell) {
            value = cell.value;
          }
          const target = filter.value
          switch (filter.operator) {
            case "is_empty":
              return value === undefined || value === null || value === "";
            case "is_not_empty":
              return value !== undefined && value !== null && value !== "";
            case "is":
              return String(value) === String(target) || (value === undefined && target === "")
            case "is_not":
              return String(value) !== String(target) && ((value === undefined && target !== "") || (value !== undefined && target === ""))
            case "contains":
              return String(value).toLowerCase().includes(String(target).toLowerCase());
            case "does_not_contain":
              return !String(value).toLowerCase().includes(String(target).toLowerCase());
            default:
              return false;
          }
        });
      });
      const searchedRows = filteredRows.filter((row) => {
        if (row.cells.length === 0 && input.searchInput.trim() === "") return true
        return row.cells.some((cell) =>
          String(cell.value).includes(input.searchInput.trim())
        )
      });
      return {
        rows: searchedRows,
        nextCursor,
      };
    }),
});
