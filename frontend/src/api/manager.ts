import { queryOptions } from "@tanstack/react-query";
import { type ApiManager } from "../../../server/app";
import { hc } from "hono/client";

const managerClient = hc<ApiManager>("/");

const getAllStudent = async () => {
  const response = await managerClient.api.manager.$get()

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data = await response.json();

  const students = data.users.filter((user) => {
    return user.roles && user.roles.name === "STUDENT" ;
  });

  const teachers = data.users.filter((user) => {
    return user.roles && user.roles.name === "TEACHER" ;
  });

  const totalUsers = data.users.length;

  
  return {
    users: data.users,
    students,
    teachers,
    totalUsers,
  };
};

export const getAllStudentQueryOption = queryOptions({
  queryKey: ["students"],
  queryFn: getAllStudent,
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

export const createUserTeacherOrAdmin = async (name: string, email: string, password: string, role: string) => {
  const response = await managerClient.api.manager["create-user"].$post({
    json: {
      name,
      email,
      password,
      role,
    },
  }, {
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  return data;
}

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
