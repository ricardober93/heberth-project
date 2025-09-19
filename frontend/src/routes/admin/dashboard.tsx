import { createFileRoute } from '@tanstack/react-router';
import { Box, Heading, Text, VStack, Card, CardBody, SimpleGrid, Stat, StatLabel, StatNumber, Button, HStack } from '@chakra-ui/react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStudentQueryOption } from '@api/manager';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useAuth();

   const { data, isLoading, isError } = useQuery(getAllStudentQueryOption);

  return (
    <AuthGuard requiredRoles={['SUPER_ADMIN']}>
      <Box>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Panel de Administración</Heading>
            <Text color="gray.600">Bienvenido, {user?.name}</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Usuarios</StatLabel>
                  <StatNumber>{data?.totalUsers}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Profesores</StatLabel>
                  <StatNumber>{ data?.teachers.length }</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Estudiantes</StatLabel>
                  <StatNumber> { data?.students.length  } </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

                  <Button colorScheme="teal" w="100%">Ver Todos los Usuarios</Button>
                  <Button colorScheme="blue" w="100%">Crear Profesor</Button>
                  <Button colorScheme="green" w="100%">Crear Administrador</Button>
                  <Button colorScheme="purple" w="100%">Gestionar Roles</Button>

          </SimpleGrid>

        </VStack>
      </Box>
    </AuthGuard>
  );
}