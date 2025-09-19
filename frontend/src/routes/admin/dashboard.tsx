import { createFileRoute } from '@tanstack/react-router';
import { Box, Heading, Text, VStack, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Button, HStack } from '@chakra-ui/react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../hooks/useAuth';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AuthGuard requiredRoles={['SUPER_ADMIN']}>
      <Box>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Panel de Administración</Heading>
            <Text color="gray.600">Bienvenido, {user?.name}</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Usuarios</StatLabel>
                  <StatNumber>245</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Profesores</StatLabel>
                  <StatNumber>18</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Estudiantes</StatLabel>
                  <StatNumber>225</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Administradores</StatLabel>
                  <StatNumber>2</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Gestión de Usuarios</Heading>
                <VStack spacing={3}>
                  <Button colorScheme="teal" w="100%">Ver Todos los Usuarios</Button>
                  <Button colorScheme="blue" w="100%">Crear Profesor</Button>
                  <Button colorScheme="green" w="100%">Crear Administrador</Button>
                  <Button colorScheme="purple" w="100%">Gestionar Roles</Button>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Actividad Reciente</Heading>
                <VStack align="stretch" spacing={2}>
                  <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold">Nuevo registro de estudiante</Text>
                    <Text fontSize="xs" color="gray.600">juan.perez@email.com - Hace 2 horas</Text>
                  </Box>
                  <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold">Profesor creado</Text>
                    <Text fontSize="xs" color="gray.600">maria.garcia@email.com - Hace 5 horas</Text>
                  </Box>
                  <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold">Rol actualizado</Text>
                    <Text fontSize="xs" color="gray.600">carlos.lopez@email.com - Ayer</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Configuración del Sistema</Heading>
              <HStack spacing={4} wrap="wrap">
                <Button colorScheme="red" variant="outline">Respaldo de Base de Datos</Button>
                <Button colorScheme="orange" variant="outline">Configuración de Email</Button>
                <Button colorScheme="yellow" variant="outline">Logs del Sistema</Button>
                <Button colorScheme="gray" variant="outline">Configuración Avanzada</Button>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </AuthGuard>
  );
}