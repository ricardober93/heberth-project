import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Text,
  Center,
} from "@chakra-ui/react";
import { getAllUser } from "@/api/manager";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  component: Users,
});

function Users() {
  const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'desc', search = '' } = Route.useSearch()
  const navigate = useNavigate();
  const currentPage = parseInt(page, 10);

  const { data, isLoading } = useQuery({
   queryKey: ['users', { page, limit, sortBy, sortOrder, search }],
    queryFn: () => getAllUser(page, limit, sortBy, sortOrder, search),
    staleTime: 5 * 60 * 1000, // 5 minutos
  }
  );

  if (isLoading || !data?.data) {
    return <Center>Cargando...</Center>;
  }

  const { data: users, pagination } = data;

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { page: newPage.toString() },
    });
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4}>
        Lista de Usuarios
      </Text>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Correo Electrónico</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={!pagination.hasPrevious}
        >
          Anterior
        </Button>
        <Text>
          Página {pagination.currentPage} de {pagination.totalPages}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={!pagination.hasNext}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}

