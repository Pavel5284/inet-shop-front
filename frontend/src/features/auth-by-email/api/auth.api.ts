import { gql, type TypedDocumentNode } from '@apollo/client'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { sessionActions, type SessionUser } from '@/entities/session'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AUTH_FIELDS = gql`
  fragment AuthFields on AuthPayload {
    accessToken
    user {
      id
      email
      firstName
      lastName
    }
  }
`

interface AuthResult {
  accessToken: string
  user: SessionUser
}

const LOGIN: TypedDocumentNode<{ login: AuthResult }, { input: LoginInput }> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthFields
    }
  }
  ${AUTH_FIELDS}
`

const REGISTER: TypedDocumentNode<{ register: AuthResult }, { input: RegisterInput }> = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...AuthFields
    }
  }
  ${AUTH_FIELDS}
`

/** После успешного входа/регистрации очищаем кэш (там могут быть данные гостя) и запоминаем сессию. */
export function useLogin() {
  const client = useApolloClient()
  const [login] = useMutation(LOGIN)
  return async (input: LoginInput) => {
    const { data } = await login({ variables: { input } })
    if (!data) throw new Error('Не удалось войти')
    await client.clearStore()
    sessionActions.setSession(data.login.accessToken, data.login.user)
  }
}

export function useRegister() {
  const client = useApolloClient()
  const [register] = useMutation(REGISTER)
  return async (input: RegisterInput) => {
    const { data } = await register({ variables: { input } })
    if (!data) throw new Error('Не удалось зарегистрироваться')
    await client.clearStore()
    sessionActions.setSession(data.register.accessToken, data.register.user)
  }
}
