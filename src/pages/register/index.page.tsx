import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { api } from '@/lib/axios'

import { Container, Form, FormError, Header } from './styles'

const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário deve ter pelo menos 3 letras' })
    .max(30, { message: 'O usuário deve ter menos de 30 letras' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
  completeName: z
    .string()
    .min(3, { message: 'Seu nome deve ter pelo menos 3 letras' })
    .max(30, { message: 'Seu nome deve ter menos de 30 letras' }),
})

type RegisterFormData = z.infer<typeof RegisterFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const query = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const username = query.get('username')
    if (username) {
      setValue('username', username as string)
    }
  }, [query, setValue])

  async function handleSubmitRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.completeName,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        alert(err.response.data.message)
        return
      }

      console.log(err)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleSubmitRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            disabled
            prefix="ignite.com/"
            placeholder="seu-usuário"
            crossOrigin=""
            {...register('username')}
          />

          {errors.username && (
            <FormError size="sm">{errors.username?.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            placeholder="seu nome"
            crossOrigin=""
            {...register('completeName')}
          />

          {errors.completeName && (
            <FormError size="sm">{errors.completeName?.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
