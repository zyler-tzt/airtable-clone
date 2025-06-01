import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        baseId: z.number(),
      }),
    )
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
            create: [{}, {}, {}],
          },
        },
        include: {
          fields: true,
          view: true,
        },
      });
      const view = await ctx.db.view.create({
        data: {
          name: "Default View",
          tableId: table.id,
        },
      });
      await ctx.db.viewField.createMany({
        data: table.fields.map((field) => ({
          viewId: view.id,
          fieldId: field.id,
        })),
      });

      return await ctx.db.table.findUnique({
        where: { id: table.id },
        include: {
          fields: true,
          view: true,
        },
      });
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
        include: { view: true },
      });
    }),

  getFields: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
        viewId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const fields = await ctx.db.field.findMany({
        where: {
          tableId: input.tableId,
          viewFields: {
            some: {
              viewId: input.viewId,
            },
          },
        },
      });

      return fields;
    }),

  getAllFields: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.field.findMany({
        where: {
          tableId: input.tableId,
        },
        include: {
          viewFields: true,
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

  createField: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
        fieldName: z.string().min(1),
        fieldType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.field.create({
        data: {
          name: input.fieldName,
          type: input.fieldType,
          table: { connect: { id: input.tableId } },
        },
      });

      const views = await ctx.db.view.findMany({
        where: { tableId: input.tableId },
      });

      console.log(views);

      await Promise.all(
        views.map((view) =>
          ctx.db.viewField.create({
            data: {
              fieldId: field.id,
              viewId: view.id,
            },
          }),
        ),
      );

      return field;
    }),

  createRow: protectedProcedure
    .input(z.object({ tableId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.row.create({
        data: {
          table: { connect: { id: input.tableId } },
        },
      });
    }),
});
