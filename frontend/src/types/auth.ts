export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
}

export interface AuthUser {
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export type Role = 'SUPER_ADMIN' | 'TEACHER' | 'STUDENT';

export const ROLES: Record<Role, Role> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
} as const;