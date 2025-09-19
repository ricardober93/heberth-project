import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '../components/auth/AuthGuard'
import { LoginForm } from '../components/auth/LoginForm'

const Component = () => {
  return (
    <AuthGuard
      fallback={<LoginForm />}
    >
      <Outlet />
    </AuthGuard>
  )
}

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  component: Component,
})