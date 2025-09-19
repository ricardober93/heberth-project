import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import type { Role } from '../types/auth';
import { useAuth } from './useAuth';

interface RoleRoutes {
  [key: string]: string;
}

const ROLE_ROUTES: RoleRoutes = {
  SUPER_ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
};

export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.navigate({ to: '/auth/login' });
      return;
    }

    // Obtener el rol principal del usuario (el primero en la lista)
    const primaryRole = user.roles?.[0] as Role;

    if (primaryRole && ROLE_ROUTES[primaryRole]) {
      const targetRoute = ROLE_ROUTES[primaryRole];
      const currentPath = window.location.pathname;

      // Solo redirigir si no está ya en la ruta correcta o en subrutas
      if (!currentPath.startsWith(targetRoute)) {
        router.navigate({ to: targetRoute });
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return {
    shouldRedirect: isAuthenticated && user?.roles?.[0],
    targetRoute: user?.roles?.[0] ? ROLE_ROUTES[user.roles[0] as Role] : null,
  };
}

export function getDefaultRouteForRole(role: Role): string {
  return ROLE_ROUTES[role] || '/student/dashboard';
}