import { createFileRoute } from '@tanstack/react-router';
import { Box, Heading, Text, Button, VStack, Card, CardBody, SimpleGrid } from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { useRoleRedirect } from '../hooks/useRoleRedirect';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Si está autenticado, redirigir según el rol
  useRoleRedirect();

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Text>Cargando...</Text>
      </Box>
    );
  }

  if (isAuthenticated && user) {
    // Esta página no debería mostrarse si está autenticado, pero por si acaso
    const primaryRole = user.roles?.[0];
    const roleNames: Record<string, string> = {
      SUPER_ADMIN: 'Administrador',
      TEACHER: 'Profesor',
      STUDENT: 'Estudiante'
    };

    return (
      <Box textAlign="center" py={20}>
        <VStack spacing={6}>
          <Heading>Bienvenido, {user.name}</Heading>
          <Text>Tu rol: {roleNames[primaryRole as keyof typeof roleNames] || primaryRole}</Text>
          <Text>Serás redirigido a tu panel correspondiente...</Text>
        </VStack>
      </Box>
    );
  }

  // Página de bienvenida para usuarios no autenticados
  return (
    <Box>
      <VStack spacing={8} textAlign="center" py={10}>
        <Box>
          <Heading size="2xl" mb={4}>
            Sistema Educativo
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Plataforma integral para la gestión educativa con roles diferenciados
            para administradores, profesores y estudiantes.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="4xl" w="100%">
          <Card>
            <CardBody textAlign="center">
              <Heading size="md" mb={3} color="teal.500">
                Para Estudiantes
              </Heading>
              <Text mb={4} fontSize="sm">
                Accede a tus cursos, tareas y calificaciones.
                Mantente al día con tu progreso académico.
              </Text>
              <Button as={RouterLink} to="/auth/register" colorScheme="teal" size="sm">
                Registrarse
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody textAlign="center">
              <Heading size="md" mb={3} color="blue.500">
                Para Profesores
              </Heading>
              <Text mb={4} fontSize="sm">
                Gestiona tus clases, califica tareas y
                supervisa el progreso de tus estudiantes.
              </Text>
              <Button as={RouterLink} to="/auth/login" colorScheme="blue" size="sm">
                Iniciar Sesión
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody textAlign="center">
              <Heading size="md" mb={3} color="purple.500">
                Para Administradores
              </Heading>
              <Text mb={4} fontSize="sm">
                Control total del sistema, gestión de usuarios
                y configuración de la plataforma.
              </Text>
              <Button as={RouterLink} to="/auth/login" colorScheme="purple" size="sm">
                Panel Admin
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box>
          <Button as={RouterLink} to="/auth/login" colorScheme="teal" size="lg" mr={4}>
            Iniciar Sesión
          </Button>
          <Button as={RouterLink} to="/auth/register" variant="outline" colorScheme="teal" size="lg">
            Registro de Estudiante
          </Button>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">
            Los profesores y administradores son creados por un administrador del sistema
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}