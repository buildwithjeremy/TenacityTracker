import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reps = pgTable("reps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  fieldTrainerId: text("field_trainer_id").notNull(),
  stage: integer("stage").notNull().default(1),
  promotionDate: timestamp("promotion_date"),
  milestones: jsonb("milestones").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fieldTrainers = pgTable("field_trainers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  assignedRepIds: jsonb("assigned_rep_ids").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  repId: text("rep_id").notNull(),
  trainerId: text("trainer_id").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRepSchema = createInsertSchema(reps).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertFieldTrainerSchema = createInsertSchema(fieldTrainers).omit({
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Rep = typeof reps.$inferSelect;
export type InsertRep = z.infer<typeof insertRepSchema>;
export type FieldTrainer = typeof fieldTrainers.$inferSelect;
export type InsertFieldTrainer = z.infer<typeof insertFieldTrainerSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Additional types for the app
export type Milestone = {
  stepId: number;
  title: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  subTasks: SubTask[];
};

export type SubTask = {
  taskId: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
};

export type UserRole = 'trainer' | 'admin';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
