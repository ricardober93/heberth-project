import { queryOptions } from "@tanstack/react-query";
import type { RegisterData, LoginData, AuthUser, User } from "../types/auth";

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
  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en el login');
  }

  return response.json();
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
const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await fetch(`${API_BASE}/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No autorizado');
  }

  const data = await response.json();
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