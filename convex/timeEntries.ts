import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    taskId: v.optional(v.id("tasks")),
    date: v.number(),
    duration: v.number(),
    description: v.string(),
    billable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("timeEntries", {
      ...args,
      userId,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("timeEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getProjectEntries = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("timeEntries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("timeEntries"),
    duration: v.number(),
    description: v.string(),
    billable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("timeEntries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.delete(args.id);
  },
});

export const getDateRangeEntries = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("timeEntries")
      .withIndex("by_date", (q) => 
        q.gte("date", args.startDate).lt("date", args.endDate)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getBillableEntries = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("timeEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("billable"), true));

    if (args.projectId) {
      query = query.filter((q) => q.eq(q.field("projectId"), args.projectId));
    }

    return await query.collect();
  },
});
