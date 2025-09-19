import { createRootRouteWithContext, Link as RouterLink, Outlet } from '@tanstack/react-router'
import { Box, Button, Flex, Link, Text, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react'
import { type QueryClient } from '@tanstack/react-query'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth'
import { AuthProvider } from '../hooks/useAuth'

interface MyRouterContext {
  queryClient: QueryClient
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  const getRoleBadge = (roles?: string[]) => {
    if (!roles || roles.length === 0) return '';
    const role = roles[0];
    const roleNames: Record<string, string> = {
      SUPER_ADMIN: 'Admin',
      TEACHER: 'Profesor',
      STUDENT: 'Estudiante'
    };
    return roleNames[role] || role;
  }

  return (
    <Flex as="nav" bg="teal.500" color="white" padding="4" alignItems="center" w="100%">
      <Flex gap={4} justifyContent="space-between" alignItems="center" w="100%">
        <Link as={RouterLink} to="/" marginRight="4" _activeLink={{ fontWeight: 'bold' }} fontSize="lg" fontWeight="bold">
          Sistema Educativo
        </Link>

        {isAuthenticated && user ? (
          <Flex gap={4} justifyContent="flex-end" alignItems="center">
            {/* Enlaces específicos por rol */}
            {user.roles?.includes('SUPER_ADMIN') && (
              <Link as={RouterLink} to="/admin/dashboard" _activeLink={{ fontWeight: 'bold' }}>
                Panel Admin
              </Link>
            )}
            {user.roles?.includes('TEACHER') && (
              <Link as={RouterLink} to="/teacher/dashboard" _activeLink={{ fontWeight: 'bold' }}>
                Panel Profesor
              </Link>
            )}
            {user.roles?.includes('STUDENT') && (
              <Link as={RouterLink} to="/student/dashboard" _activeLink={{ fontWeight: 'bold' }}>
                Mi Dashboard
              </Link>
            )}

            {/* Menu de usuario */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="ghost">
                <Flex alignItems="center" gap={2}>
                  <Avatar size="sm" name={user.name} />
                  <Box textAlign="left">
                    <Text fontSize="sm">{user.name}</Text>
                    <Text fontSize="xs" opacity={0.8}>{getRoleBadge(user.roles)}</Text>
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList color="black">
                <MenuItem onClick={handleLogout}>
                  Cerrar Sesión
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Flex gap={4} justifyContent="flex-end" alignItems="center">
            <Link as={RouterLink} to="/auth/login" _activeLink={{ fontWeight: 'bold' }}>
              Iniciar Sesión
            </Link>
            <Link as={RouterLink} to="/auth/register" _activeLink={{ fontWeight: 'bold' }}>
              Registro
            </Link>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AuthProvider>
      <Navbar />
      <Box padding="4">
        <Outlet />
      </Box>
    </AuthProvider>
  ),
})

