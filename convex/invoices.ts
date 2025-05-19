import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

function generateInvoiceReference() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    clientId: v.id("clients"),
    amount: v.number(),
    dueDate: v.number(),
    items: v.array(
      v.object({
        description: v.string(),
        hours: v.number(),
        rate: v.number(),
      })
    ),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    taxes: v.optional(v.array(v.object({
      name: v.string(),
      rate: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("invoices", {
      ...args,
      userId,
      status: "pending",
      issueDate: Date.now(),
      reference: generateInvoiceReference(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("invoices"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const updates = {
      status: args.status,
      paidDate: args.status === "paid" ? Date.now() : undefined,
    };
    
    return await ctx.db.patch(args.id, updates);
  },
});

export const listByStatus = query({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("invoices")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const listByDueDate = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("invoices")
      .withIndex("by_due_date", (q) => 
        q.gte("dueDate", args.startDate).lt("dueDate", args.endDate)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getOverdue = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("invoices")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.lt(q.field("dueDate"), Date.now())
        )
      )
      .collect();
  },
});
