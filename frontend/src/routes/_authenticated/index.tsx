import { createFileRoute } from '@tanstack/react-router'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Card,
  CircularProgress,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotesQueryOption, allNotesQueryOptions, deleteNote } from '../../api/manager'
import { Note } from '../../../../server/models/note'

export const Route = createFileRoute('/_authenticated/')({
  component: () => <App />,
})

function App() {
  // Assume we have a state to store the notes
  const { data: notes, isLoading, isError } = useQuery(getNotesQueryOption)

  const { data: allNotes } = useQuery(allNotesQueryOptions)

  if (isLoading)
    return (
      <Flex justifyContent="center" alignItems="center" w="100vw" h="100vh">
        <CircularProgress value={80} />
      </Flex>
    )
  if (isError)
    return (
      <Flex justifyContent="center" alignItems="center" w="100vw" h="100vh">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Ha ocurrido un error</AlertTitle>
          <AlertDescription>
            No se pudo obtener la información de las notas
          </AlertDescription>
        </Alert>
      </Flex>
    )


  return (
    <Flex direction="column" w="100vw" h="100vh" p={5}>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mb={5}
      >
        <Card p={5} shadow="md" borderWidth="1px" borderRadius="md" flex="1">
          <Stat>
            <StatLabel fontSize="xl">Total Notes</StatLabel>
            <StatNumber fontSize="4xl">
              {notes ? notes.totalNotes : '0'}
            </StatNumber>
          </Stat>
        </Card>
      </Flex>


      <TableContainer>
        <Table variant='simple'>
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Title</Th>
              <Th >Content</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              allNotes && (allNotes.notes).map((note: Note) => (
                <Tr key={note.id}>
                  <Td>{note.id}</Td>
                  <Td>{note?.title}</Td>
                  <Td >{note?.content}</Td>
                 < Td > <DeleteNoteButton id={note.id} /> </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}


function DeleteNoteButton({ id }: { id: number }) {
  const toast = useToast()
  const queryClient = useQueryClient();
  const mutation  = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
       
      queryClient.invalidateQueries({
        queryKey: allNotesQueryOptions.queryKey,
        exact: true,
        refetchType: 'all',
      });

      toast({
        title: 'Nota eliminada.',
        description: "Se ha eliminado la nota correctamente.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    },
    onError: () => {
      toast({
        title: 'Error al eliminar la nota.',
        description: "No se ha podido eliminar la nota.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  })

  return (
    <IconButton 
    variant='ghost'
    aria-label='Delete'
    disabled={mutation.isPending}
    onClick={() => mutation.mutate(id)}>
      <DeleteIcon color='red'></DeleteIcon>
    </IconButton>
  )
}

