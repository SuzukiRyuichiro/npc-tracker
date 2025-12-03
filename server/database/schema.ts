import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  content: text("content"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const rides = sqliteTable("rides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  endedAt: integer("ended_at", { mode: "timestamp" }),
});
