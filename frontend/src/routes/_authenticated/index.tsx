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
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getNotesQueryOption } from '../../api/manager'

export const Route = createFileRoute('/_authenticated/')({
  component: () => <App />,
})

function App() {
  // Assume we have a state to store the notes
  const { data: notes, isLoading, isError } = useQuery(getNotesQueryOption)

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

      {/* Rest of your app content */}
    </Flex>
  )
}
