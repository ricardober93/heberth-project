import { queryOptions } from "@tanstack/react-query";
import { type ApiManager } from "../../../server/app";
import { hc } from "hono/client";

const managerClient = hc<ApiManager>("/");

const getNotes = async () => {
  const response = await managerClient.api.manager["total"].$get({}, {
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data = await response.json();
  return data;
};

export const getNotesQueryOption = queryOptions({
  queryKey: ["notes"],
  queryFn: getNotes,
});

const allNotes = async () => {
  const response = await managerClient.api.manager.$get({}, {

  });

  if (!response.ok) {
    throw new Error("Failed to fetch all notes");
  }

  const data = await response.json();
  return data;
};

export const allNotesQueryOptions = queryOptions({
  queryKey: ["allNotes"],
  queryFn: allNotes,
});

export const createNote = async (title: string, content: string) => {
  const response = await managerClient.api.manager["create"].$post({
    json: {
      title,
      content,
    },
  }, {
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  const data = await response.json();
  return data;
};

export const deleteNote = async (id: number) => {
  const response = await managerClient.api.manager[":id"].$delete({
    param: { id: id.toString() },
  }, {
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  const data = await response.json();
  return data;
};
