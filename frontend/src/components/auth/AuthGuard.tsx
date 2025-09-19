import { ReactNode } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: Role[];
  fallback?: ReactNode;
}

export function AuthGuard({ children, requiredRoles, fallback }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Mostrar spinner mientras se carga
  if (isLoading) {
    return (
      <VStack justify="center" minH="200px">
        <Spinner size="xl" color="teal.500" />
        <Text>Verificando autenticación...</Text>
      </VStack>
    );
  }

  // Si no está autenticado
  if (!isAuthenticated || !user) {
    return fallback || (
      <Box textAlign="center" py={8}>
        <Text>Necesitas iniciar sesión para acceder a esta página</Text>
      </Box>
    );
  }

  // Si se requieren roles específicos
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return fallback || (
        <Box textAlign="center" py={8}>
          <Text color="red.500">
            No tienes permisos para acceder a esta página
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Roles requeridos: {requiredRoles.join(', ')}
          </Text>
        </Box>
      );
    }
  }

  return <>{children}</>;
}