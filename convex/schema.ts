import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    company: v.optional(v.string()),
    website: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    status: v.optional(v.string()), // prospect, active, inactive
    lastContactDate: v.optional(v.number()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_tags", ["tags"]),

  projects: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.string(), // draft, active, paused, completed, cancelled
    clientId: v.id("clients"),
    userId: v.id("users"),
    rate: v.number(),
    budget: v.optional(v.number()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      dueDate: v.number(),
      completed: v.boolean(),
      description: v.optional(v.string()),
    }))),
    team: v.optional(v.array(v.object({
      name: v.string(),
      role: v.string(),
      email: v.optional(v.string()),
    }))),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_tags", ["tags"]),

  invoices: defineTable({
    projectId: v.id("projects"),
    clientId: v.id("clients"),
    userId: v.id("users"),
    amount: v.number(),
    status: v.string(), // draft, pending, paid, overdue, cancelled
    dueDate: v.number(),
    issueDate: v.optional(v.number()),
    paidDate: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        description: v.string(),
        hours: v.number(),
        rate: v.number(),
      })
    ),
    terms: v.optional(v.string()),
    taxes: v.optional(v.array(v.object({
      name: v.string(),
      rate: v.number(),
    }))),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // backlog, todo, in_progress, review, completed
    priority: v.string(), // low, medium, high, urgent
    projectId: v.optional(v.id("projects")),
    userId: v.id("users"),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
    }))),
    subtasks: v.optional(v.array(v.object({
      title: v.string(),
      completed: v.boolean(),
    }))),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_assigned", ["assignedTo"]),

  contacts: defineTable({
    clientId: v.id("clients"),
    userId: v.id("users"),
    name: v.string(),
    role: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isMainContact: v.boolean(),
    notes: v.optional(v.string()),
    lastContactDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"]),

  expenses: defineTable({
    projectId: v.optional(v.id("projects")),
    userId: v.id("users"),
    amount: v.number(),
    date: v.number(),
    category: v.string(),
    description: v.string(),
    receipt: v.optional(v.string()), // Storage ID
    status: v.string(), // pending, approved, reimbursed
    reimbursedDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_category", ["category"]),

  timeEntries: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    taskId: v.optional(v.id("tasks")),
    date: v.number(),
    duration: v.number(), // in minutes
    description: v.string(),
    billable: v.boolean(),
    invoiceId: v.optional(v.id("invoices")),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_task", ["taskId"])
    .index("by_date", ["date"]),

  documents: defineTable({
    projectId: v.optional(v.id("projects")),
    clientId: v.optional(v.id("clients")),
    userId: v.id("users"),
    name: v.string(),
    type: v.string(),
    category: v.string(),
    storageId: v.string(),
    size: v.number(),
    uploadDate: v.number(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_client", ["clientId"])
    .index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
