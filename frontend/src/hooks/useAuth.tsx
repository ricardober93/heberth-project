import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { currentUserQueryOptions, login, logout, registerStudent } from '../api/auth';
import type { User, LoginData, RegisterData, Role } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: authData,
    isLoading,
    error
  } = useQuery(currentUserQueryOptions);

  const user = authData?.user || null;
  const isAuthenticated = !!user && !error;

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.navigate({ to: '/auth/login' });
    },
  });

  const handleLogin = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
    // La redirección por rol se manejará en el componente
  };

  const handleRegister = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
    // Después del registro, redirigir al dashboard de estudiante
    router.navigate({ to: '/student/dashboard' });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const hasRole = (role: Role): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}