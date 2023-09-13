import { Button, TextInput, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'

import { Form, FormAnnotation } from './styles'

const claimUsernameFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'O usuário deve ter pelo menos 3 letras' })
      .max(30, { message: 'O usuário deve ter menos de 30 letras' })
      .regex(/^([a-z\\\\-]+)$/i, {
        message: 'O usuário pode ter apenas letras e hifens',
      })
      .transform((username) => username.toLowerCase()),
  })
  .required()

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    await router.push({ pathname: '/register', query: data })
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
          crossOrigin=""
        />
        <Button disabled={isSubmitting} size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        {errors.username ? (
          <Text size="sm" style={{ color: '#ff746a' }}>
            {errors.username?.message}
          </Text>
        ) : (
          <Text size="sm">Digite o usuário desejado</Text>
        )}
      </FormAnnotation>
    </>
  )
}
