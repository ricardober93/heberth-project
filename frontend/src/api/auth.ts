import { queryOptions } from "@tanstack/react-query";
import type { RegisterData, LoginData } from "../types/auth";
import { hc } from "hono/client";
import { type  ApiManager } from "../../../server/app";

const authClient = hc<ApiManager>("/");

const API_BASE = "/api";

// Registro de estudiantes
export const registerStudent = async (data: RegisterData) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en el registro');
  }

  return response.json();
};

// Login
export const login = async (data: LoginData) => {

  const response = await fetch(`${API_BASE}/auth/sign-in/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en el login');
  }

  return await  response.json();
};

// Logout
export const logout = async () => {
  const response = await fetch(`${API_BASE}/auth/sign-out`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al cerrar sesión');
  }

  return response.json();
};

// Obtener usuario actual
const getCurrentUser = async (): Promise<any> => {
  const response = await authClient.api.me.$get();
  if (!response.ok) {
    throw new Error('No autorizado');
  }

  const res = await response.json() as any;
 const data = { ...res};

  return data;
};

export const currentUserQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 minutos
  retry: false,
});

// Obtener roles disponibles
export const getRoles = async () => {
  const response = await fetch(`${API_BASE}/roles`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al obtener roles');
  }

  return response.json();
};