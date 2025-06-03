import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.create({
        data: {
          name: input.name,
          slug: nanoid(10),
          createdBy: { connect: { id: ctx.session.user.id } },
          tables: {
            create: [
              {
                name: "Table 1",
                slug: nanoid(10),
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
                view: {
                  create: {
                    name: "Default View",
                  },
                },
              },
            ],
          },
        },
        include: {
          tables: {
            include: {
              fields: true,
              view: true,
            },
          },
        },
      });

      const table = base.tables[0];
      const viewId = table?.view[0]?.id;

      if (table?.fields?.length && viewId) {
        await ctx.db.viewField.createMany({
          data: table.fields.map((field) => ({
            viewId,
            fieldId: field.id,
          })),
        });
      }

      return base;
    }),

  getBases: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const bases = await ctx.db.base.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdById: input.userId },
      });

      return bases;
    }),

  deleteBase: protectedProcedure
    .input(z.object({ baseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.base.delete({
        where: { id: input.baseId },
      });
    }),

  getBaseBySlug: protectedProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({
        where: { slug: input.slug },
        include: {
          tables: {
            orderBy: {
              id: 'asc'
            },
          }
        },
      });
      return base;
    }),

  getFirstTableByBaseId: protectedProcedure
    .input(z.object({ baseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findFirst({
        where: { baseId: input.baseId },
      });

      return table;
    }),
});
