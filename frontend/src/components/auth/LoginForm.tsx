import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Heading,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { useRoleRedirect, getDefaultRouteForRole } from '../../hooks/useRoleRedirect';
import type { LoginData, Role } from '../../types/auth';

export function LoginForm() {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(formData);
      // La redirección se manejará automáticamente por el hook useRoleRedirect

      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Si ya está autenticado, el hook se encargará de redirigir
  useRoleRedirect();

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              Iniciar Sesión
            </Heading>
            <Text textAlign="center" color="gray.600">
              Accede con tus credenciales
            </Text>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box w="100%">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ingresa tu email"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    w="100%"
                    isLoading={isLoading}
                    loadingText="Iniciando sesión..."
                  >
                    Iniciar Sesión
                  </Button>
                </VStack>
              </form>
            </Box>

            <VStack spacing={2} textAlign="center">
              <Text>
                ¿Eres estudiante y no tienes cuenta?{' '}
                <Link as={RouterLink} to="/auth/register" color="teal.500">
                  Regístrate aquí
                </Link>
              </Text>
              <Text fontSize="sm" color="gray.500">
                Los profesores y administradores deben ser creados por un administrador
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}