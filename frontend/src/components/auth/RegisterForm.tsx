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
import type { RegisterData } from '../../types/auth';

export function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
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
      await register(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el registro');
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

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              Registro de Estudiante
            </Heading>
            <Text textAlign="center" color="gray.600">
              Crea tu cuenta para acceder como estudiante
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
                    <FormLabel>Nombre completo</FormLabel>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </FormControl>

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
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    w="100%"
                    isLoading={isLoading}
                    loadingText="Creando cuenta..."
                  >
                    Registrarse como Estudiante
                  </Button>
                </VStack>
              </form>
            </Box>

            <Text textAlign="center">
              ¿Ya tienes cuenta?{' '}
              <Link as={RouterLink} to="/auth/login" color="teal.500">
                Inicia sesión aquí
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}