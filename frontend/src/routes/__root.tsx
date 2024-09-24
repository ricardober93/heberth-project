import { createRootRouteWithContext , Link as RouterLink, Outlet } from '@tanstack/react-router'
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { type QueryClient } from '@tanstack/react-query'
import { userQueryOptions } from '../api/manager'

interface MyRouterContext {
  queryClient: QueryClient
}

function Navbar() {
  const { user } = Route.useRouteContext()
  return (
    <Flex as="nav" bg="teal.500" color="white" padding="4" alignItems="center" w="100%">
    <Flex gap={4} justifyContent="space-between" alignItems="center" w="100%">
      <Link as={RouterLink} to="/" marginRight="4" _activeLink={{ fontWeight: 'bold' }}>
        Notes
      </Link>
      <Flex gap={4} justifyContent="flex-end">
        <Link as={RouterLink} to="/about" _activeLink={{ fontWeight: 'bold' }}>
          About
        </Link>
        <Link as={RouterLink} to="/create" _activeLink={{ fontWeight: 'bold' }}>
          Create
        </Link>
      </Flex>
      {user ? (
        <Button colorScheme='gray' variant='solid'  as={RouterLink} to="api/logout" _activeLink={{ fontWeight: 'bold' }}>
          Logout
        </Button>
      ) : (
        <Button colorScheme='gray' variant='solid'  as={RouterLink} to="api/login" _activeLink={{ fontWeight: 'bold' }}>
          Login
        </Button>
      )}
    </Flex>
  </Flex>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({context}) => {
    try {
      const data = await context.queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (error) {
      console.error(error)
      return { user: null }
    }
  },
  component: () => (
    <>
     <Navbar />
      <Box padding="4">
        <Outlet />
      </Box>
    </>
  ),
})

