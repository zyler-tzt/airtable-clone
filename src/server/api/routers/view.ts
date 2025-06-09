import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const viewRouter = createTRPCRouter({
  createView: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tableId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.create({
        data: {
          tableId: input.tableId,
          name: input.name,
        },
      });
      const fields = await ctx.db.field.findMany({
        where: {
          tableId: input.tableId,
        },
      });
      if (fields.length > 0) {
        await ctx.db.viewField.createMany({
          data: fields.map((field) => ({
            viewId: view.id,
            fieldId: field.id,
          })),
        });
      }

      return view;
    }),

  deleteView: protectedProcedure
  .input(
    z.object({
      viewId: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
      await ctx.db.view.delete({
        where: {
          id: input.viewId,
        },
      });
    }),


  createSort: protectedProcedure
    .input(
      z.object({
        viewId: z.number(),
        fieldId: z.number(),
        order: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.sorting.create({
        data: {
          viewId: input.viewId,
          fieldId: input.fieldId,
          order: input.order,
        },
      });
    }),

  deleteSort: protectedProcedure
    .input(
      z.object({
        sorterId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.sorting.delete({
        where: {
          id: input.sorterId,
        },
      });
    }),

  getSorts: protectedProcedure
    .input(
      z.object({
        viewId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.sorting.findMany({
        where: {
          viewId: input.viewId,
        },
        orderBy: {
          id: "asc",
        },
      });
    }),

  modifySort: protectedProcedure
  .input(
    z.object({
      sorterId: z.number(),
      newOrder: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.sorting.update({
      where: {
        id: input.sorterId,
      },
      data: {
        order: input.newOrder,
      },
    });
  }),

  createFilter: protectedProcedure
    .input(
      z.object({
        viewId: z.number(),
        fieldId: z.number(),
        value: z.string(),
        operator: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.filter.create({
        data: {
          viewId: input.viewId,
          fieldId: input.fieldId,
          value: input.value,
          operator: input.operator,
        },
      });
    }),

  getFilters: protectedProcedure
  .input(
    z.object({
      viewId: z.number(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return await ctx.db.filter.findMany({
      where: {
        viewId: input.viewId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }),

  modifyValueFilter: protectedProcedure
  .input(
    z.object({
      filterId: z.number(),
      newValue: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.filter.update({
      where: {
        id: input.filterId,
      },
      data: {
        value: input.newValue,
      },
    });
  }),

  modifyOperatorFilter: protectedProcedure
  .input(
    z.object({
      filterId: z.number(),
      newValue: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.filter.update({
      where: {
        id: input.filterId,
      },
      data: {
        operator: input.newValue,
      },
    });
  }),


  deleteFilter: protectedProcedure
    .input(
      z.object({
        filterId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.filter.delete({
        where: {
          id: input.filterId,
        },
      });
    }),

  createViewField: protectedProcedure
    .input(
      z.object({
        viewId: z.number(),
        fieldId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.viewField.create({
        data: {
          viewId: input.viewId,
          fieldId: input.fieldId,
        },
      });
    }),

  deleteViewField: protectedProcedure
    .input(
      z.object({
        viewId: z.number(),
        fieldId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.viewField.delete({
        where: {
          viewId_fieldId: {
            viewId: input.viewId,
            fieldId: input.fieldId,
          },
        },
      });
    }),
});
