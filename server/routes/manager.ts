import { Hono } from "hono";
import { CreateNoteValidationSchema, type Note } from "../models/note";
import { zValidator } from "@hono/zod-validator";
import { userMiddleware } from "../kinde";

import { db } from "../db";
import { notes as notesTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const manager = new Hono()
  .get("/", userMiddleware, async (c) => {
    const user = c.get("user");
    const notes = await db.select().from(notesTable).where(eq(notesTable.userId, user.id));
    return c.json(
      {
        notes,
      },
      200
    );
  }) // GET /book
  .get("/:id{[0-9]+}", userMiddleware, async (c) => {
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
  .get("/total", userMiddleware, async (c) => {
    const user = c.get("user");
    const totalNotes = (await db.select().from(notesTable).where(eq(notesTable.userId, user.id))).length;

    return await c.json(
      {
        totalNotes,
      },
      200
    );
  })
  .post("/create", userMiddleware, zValidator("json", CreateNoteValidationSchema), async (c) => {
    const body = (await c.req.json()) as Note;
    const user = c.get("user");

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
  .put("/:id{[0-9]+}", userMiddleware, async (c) => {
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
  .delete("/:id", userMiddleware, async (c) => {
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
