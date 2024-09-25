import { queryOptions } from "@tanstack/react-query";
import { type ApiManager } from "../../../server/app";
import { hc } from "hono/client";

const managerClient = hc<ApiManager>("/");

const getNotes = async () => {
  const response = await managerClient.api.manager["total"].$get();
  const data = await response.json();
  return data;
};

export const getNotesQueryOption = queryOptions({
  queryKey: ["notes"],
  queryFn: getNotes,
});

const getUser = async () => {
  const response = await managerClient.api.me.$get();

  if (response.status !== 200) {
    throw new Error("Failed to fetch user");
  }

  const data = await response.json();
  return data;
};

export const userQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: getUser,
  staleTime: Infinity,
});

const allNotes = async () => {
  const response = await managerClient.api.manager.$get();

  if (response.status !== 200) {
    throw new Error("Failed to fetch allNOtes");
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
  });
  const data = await response.json();
  return data;
};

export const deleteNote = async (id: number) => {
  const response = await managerClient.api.manager[":id"].$delete({
    param: { id: id.toString() },
  });
  const data = await response.json();
  return data;
};
