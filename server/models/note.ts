import { z } from 'zod';

export interface Note {
  id: number;
  userId: string;
  title: string  | null;
  content: string | null;
}

// Zod schema for Note validation
export const NoteValidationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title must be less than 100 characters' }),
  content: z.string().min(1, { message: 'Content is required' }),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Zod schema for creating a new note (without id and timestamps)
export const CreateNoteValidationSchema = NoteValidationSchema.omit({ id: true, createdAt: true, updatedAt: true, userId: true });

// Type for creating a new note
export type CreateNoteInput = z.infer<typeof CreateNoteValidationSchema>;
