import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const superintendents = pgTable("superintendents", {
  districtId: integer("district_id").primaryKey(),
  name: text("name").notNull(),
});
