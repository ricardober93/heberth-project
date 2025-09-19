import { Hono } from "hono";
import { CreateNoteValidationSchema, type Note } from "../models/note";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, requireRole, ROLES, type AuthContext } from "../auth/middleware";

import { db } from "../db";
import { notes as notesTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const manager = new Hono<{ Variables: { user: { id: string; name: string; email: string; roles?: string[]}}}>()
  .get("/", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), async (c: AuthContext) => {
    const user = c.user!;
    const notes = await db.select().from(notesTable).where(eq(notesTable.userId, user.id));
    return c.json(
      {
        notes,
      },
      200
    );
  }) // GET /book
  .get("/:id{[0-9]+}", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), async (c: AuthContext) => {
    // GET /manager/:id
    const id = Number(c.req.param("id"));
    const note = await db.select().from(notesTable).where(eq(notesTable.id, id));

    if (!note) {
      return c.status(404);
    }
    return c.json(
      {
        note,
      },
      200
    );
  })
  .get("/total", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), async (c: AuthContext) => {
    const user = c.user!;
    const totalNotes = (await db.select().from(notesTable).where(eq(notesTable.userId, user.id))).length;

    return await c.json(
      {
        totalNotes,
      },
      200
    );
  })
  .post("/create", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), zValidator("json", CreateNoteValidationSchema), async (c: AuthContext) => {
    const body = (await c.req.json()) as Note;
    const user = c.user!;

    const newNote = await db.insert(notesTable).values({
      userId: user.id,
      title: body.title,
      content: body.content,
    });
    return c.json(
      {
        newNote,
      },
      200
    );
  }) // POST
  .put("/:id{[0-9]+}", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), async (c: AuthContext) => {
    const id = Number(c.req.param("id"));
    const body = (await c.req.json()) as Note;

    const note = await db.select().from(notesTable).where(eq(notesTable.id, id));

    if (!note) {
      return c.status(404);
    }
    const updatedNote = await db
      .update(notesTable)
      .set({
        title: body.title,
        content: body.content,
      })
      .where(eq(notesTable.id, id));
    return c.json(
      {
        updatedNote,
      },
      200
    );
  }) // PUT
  .delete("/:id", authMiddleware, requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN), async (c: AuthContext) => {
    const id = Number(c.req.param("id"));

    const note = await db.select().from(notesTable).where(eq(notesTable.id, id));

    if (!note) {
      return c.status(404);
    }

    const deletedNote = await db.delete(notesTable).where(eq(notesTable.id, id));

    return c.json(
      {
        deletedNote,
      },
      200
    );
  }); // DELETE
