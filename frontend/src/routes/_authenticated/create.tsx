import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button, Flex, Input, Textarea, VStack } from '@chakra-ui/react'
import { createNote } from '../../api/manager'
import { CreateNoteValidationSchema } from '../../../../server/models/note'

export const Route = createFileRoute('/_authenticated/create')({
  component: Create,
})

function Create() {
  const navigate = useNavigate()

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      const response = await createNote(value.title, value.content)

      console.log(response)

      navigate({ to: '/' })
    },
  })
  return (
    <Flex flexDirection={'column'} gap={4} p={4}>
      <VStack
        as={'form'}
        alignItems={'flex-start'}
        maxW={'container.xl'}
        mx={'auto'}
        gap={4}
        p={4}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Flex>
          <form.Field
            name="title"
            validators={{
              onChange: CreateNoteValidationSchema.shape.title,
            }}
            children={(field) => (
              <Flex flexDirection={'column'} gap={2}>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Title"
                />
                {field.state.meta.isTouched ? (
                  <em>{field.state.meta.errors}</em>
                ) : null}
              </Flex>
            )}
          />
        </Flex>

        <Flex>
          <form.Field
            name="content"
            validators={{
              onChange: CreateNoteValidationSchema.shape.content,
            }}
            children={(field) => (
              <Flex flexDirection={'column'} gap={2}>
                <Textarea
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Content"
                />
                {field.state.meta.isTouched ? (
                  <em>{field.state.meta.errors}</em>
                ) : null}
              </Flex>
            )}
          />
        </Flex>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Crear Nota'}
            </Button>
          )}
        />
      </VStack>
    </Flex>
  )
}
