import { getRolesQueryOptions } from "@/api/auth";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  Card,
  CardBody,
  Center,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { createUserTeacherOrAdmin } from "@/api/manager";

export const Route = createFileRoute("/admin/create/")({
  loader: async ({ context }) => {
    const { rolesData: roles } =
      await context.queryClient.fetchQuery(getRolesQueryOptions);

    return roles;
  },
  component: create,
});

function create() {
  const { role } = Route.useSearch() as { role: string };
  const toast = useToast();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: role,
    },
    onSubmit: async ({ value }) => {
      try {
        if (!value.name || value.name.length < 3) {
          throw new Error("El nombre debe tener al menos 3 caracteres.");
        }
        if (!value.email || !value.email.includes("@")) {
          throw new Error("El correo electrónico no es válido.");
        }
        createUserTeacherOrAdmin(
          value.name,
          value.email,
          value.password,
          value.role
        );
        toast({
          title: "Usuario creado.",
          description: "El usuario ha sido creado exitosamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate({
          to: "/",
        });
      } catch (error: any) {
        toast({
          title: "Error al enviar el formulario",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <Center minH="100vh">
      <Card w="100%" maxW="500px" boxShadow="lg">
        <CardBody>
          <Box p={6}>
            <Heading size="lg" mb={4} textAlign="center">
              Crear Nuevo {role}
            </Heading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FormControl mb={4} isInvalid={form.state.isValid}>
                <FormLabel htmlFor="name">Nombre:</FormLabel>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "El nombre es obligatorio."
                        : value.length < 3
                          ? "El nombre debe tener al menos 3 caracteres."
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FormErrorMessage>
                        {field.state.meta.isTouched ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
              <FormControl mb={4} isInvalid={form.state.isValid}>
                <FormLabel htmlFor="email">Correo Electrónico:</FormLabel>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "El correo electrónico es obligatorio."
                        : !value.includes("@")
                          ? "El correo electrónico no es válido."
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FormErrorMessage>
                        {field.state.meta.isTouched ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
              <FormControl mb={4} isInvalid={form.state.isValid}>
                <FormLabel htmlFor="password">Contraseña:</FormLabel>
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "La contraseña es obligatoria."
                        : value.length < 6
                          ? "La contraseña debe tener al menos 6 caracteres."
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FormErrorMessage>
                        {field.state.meta.isTouched ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
              <FormControl mb={4} isInvalid={form.state.isValid}>
                <FormLabel htmlFor="confirmPassword">
                  Confirmar Contraseña:
                </FormLabel>
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value, fieldApi }) =>
                      !value
                        ? "Debe confirmar la contraseña."
                        : value !== fieldApi.form.getFieldValue("password")
                          ? "Las contraseñas no coinciden."
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FormErrorMessage>
                        {field.state.meta.isTouched ? (
                          <em>{field.state.meta.errors.join(", ")}</em>
                        ) : null}
                      </FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isDisabled={!canSubmit}
                    isLoading={isSubmitting}
                    w="100%"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </Button>
                )}
              />
            </form>
          </Box>
        </CardBody>
      </Card>
    </Center>
  );
}
