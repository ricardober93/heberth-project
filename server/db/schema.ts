import { index, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';


export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: varchar('name', { length: 256 }),
  content: varchar('content', { length: 256 }),
}, (notes) => {
  return {
    UserIdIndex: index('user_id_idx').on(notes.userId),
  }
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
