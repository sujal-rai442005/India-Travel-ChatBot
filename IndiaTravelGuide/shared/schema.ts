import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  category: text("category").notNull(), // nature, historical, spiritual, adventure, cultural
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  bestTimeToVisit: text("best_time_to_visit"),
  localFood: jsonb("local_food").$type<string[]>(),
  travelTips: text("travel_tips"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey(),
  message: text("message").notNull(),
  isBot: varchar("is_bot").notNull(), // 'true' or 'false'
  timestamp: text("timestamp").notNull(),
  location: text("location"),
  recommendations: jsonb("recommendations").$type<Recommendation[] | null>(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export interface Recommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface ChatRequest {
  message: string;
  location?: string;
}

export interface ChatResponse {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
  recommendations?: Recommendation[];
  travelTip?: string;
}
