import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'


import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const queryClient = new QueryClient()


// Import your routes
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree, context: { queryClient } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
