import { createFileRoute } from '@tanstack/react-router';
import { Box, Heading, Text, VStack, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Button } from '@chakra-ui/react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../hooks/useAuth';

export const Route = createFileRoute('/teacher/dashboard')({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <AuthGuard requiredRoles={['TEACHER', 'SUPER_ADMIN']}>
      <Box>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Dashboard del Profesor</Heading>
            <Text color="gray.600">Bienvenido, {user?.name}</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Clases Activas</StatLabel>
                  <StatNumber>3</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Estudiantes</StatLabel>
                  <StatNumber>85</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Tareas por Calificar</StatLabel>
                  <StatNumber>12</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Promedio de Clase</StatLabel>
                  <StatNumber>7.8</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Clases de Hoy</Heading>
                <VStack align="stretch" spacing={3}>
                  <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Text fontWeight="bold">Matemáticas Avanzadas</Text>
                    <Text fontSize="sm" color="gray.600">9:00 AM - Aula 201</Text>
                    <Text fontSize="sm" color="gray.600">28 estudiantes</Text>
                  </Box>
                  <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                    <Text fontWeight="bold">Cálculo I</Text>
                    <Text fontSize="sm" color="gray.600">2:00 PM - Aula 105</Text>
                    <Text fontSize="sm" color="gray.600">32 estudiantes</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Acciones Rápidas</Heading>
                <VStack spacing={3}>
                  <Button colorScheme="teal" w="100%">Crear Nueva Tarea</Button>
                  <Button colorScheme="blue" w="100%">Ver Calificaciones</Button>
                  <Button colorScheme="green" w="100%">Gestionar Estudiantes</Button>
                  <Button colorScheme="purple" w="100%">Material de Clase</Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Box>
    </AuthGuard>
  );
}