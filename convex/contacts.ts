import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.string(),
    role: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isMainContact: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("contacts", {
      ...args,
      userId,
      lastContactDate: Date.now(),
    });
  },
});

export const list = query({
  args: {
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const query = ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.clientId) {
      return await query
        .filter((q) => q.eq(q.field("clientId"), args.clientId))
        .collect();
    }

    return await query.collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("contacts"),
    name: v.string(),
    role: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isMainContact: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const updateLastContact = mutation({
  args: {
    id: v.id("contacts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.patch(args.id, {
      lastContactDate: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.delete(args.id);
  },
});
