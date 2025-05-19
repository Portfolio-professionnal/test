import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
    name: v.string(),
    type: v.string(),
    category: v.string(),
    storageId: v.string(),
    size: v.number(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("documents", {
      ...args,
      userId,
      uploadDate: Date.now(),
    });
  },
});

export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.projectId) {
      query = query.filter((q) => q.eq(q.field("projectId"), args.projectId));
    }
    if (args.clientId) {
      query = query.filter((q) => q.eq(q.field("clientId"), args.clientId));
    }

    const documents = await query.collect();

    return await Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    );
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Document not found");
    
    await ctx.storage.delete(doc.storageId);
    await ctx.db.delete(args.id);
  },
});
