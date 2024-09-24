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
