import { createFileRoute } from '@tanstack/react-router';
import { Box, Heading, Text, VStack, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../hooks/useAuth';

export const Route = createFileRoute('/student/dashboard')({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();

  return (
    <AuthGuard requiredRoles={['STUDENT']}>
      <Box>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Dashboard del Estudiante</Heading>
            <Text color="gray.600">Bienvenido, {user?.name}</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Cursos Inscritos</StatLabel>
                  <StatNumber>5</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Tareas Pendientes</StatLabel>
                  <StatNumber>3</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Promedio General</StatLabel>
                  <StatNumber>8.5</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Próximas Actividades</Heading>
              <VStack align="stretch" spacing={2}>
                <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                  <Text fontWeight="bold">Examen de Matemáticas</Text>
                  <Text fontSize="sm" color="gray.600">Fecha: 25 de Septiembre</Text>
                </Box>
                <Box p={3} border="1px" borderColor="gray.200" borderRadius="md">
                  <Text fontWeight="bold">Entrega de Proyecto de Historia</Text>
                  <Text fontSize="sm" color="gray.600">Fecha: 30 de Septiembre</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </AuthGuard>
  );
}