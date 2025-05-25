import { z } from "zod";
import { nanoid } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
                  create: [
                    {}, {}, {},
                  ]
                }
              }
            ]
          }
        },
      });

      return base;
    }),

  getBases: protectedProcedure.query(async ({ ctx }) => {
    const bases = await ctx.db.base.findMany({
      orderBy: { createdAt: "desc" },
    });

    return bases
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
          tables: true
        }
      });
    return base;
  }),

  getFirstTableByBaseId: protectedProcedure
    .input(z.object({ baseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findFirst({
        where: { baseId: input.baseId },
      });

      return table
    }),

});

