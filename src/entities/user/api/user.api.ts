import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'

export interface Me {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  address: string | null
  createdAt: string
}

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
}

const ME_QUERY: TypedDocumentNode<{ me: Me }, Record<string, never>> = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      phone
      address
      createdAt
    }
  }
`

const UPDATE_PROFILE: TypedDocumentNode<{ updateProfile: Me }, { input: UpdateProfileInput }> = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      firstName
      lastName
      phone
      address
      createdAt
    }
  }
`

export const useMe = () => useQuery(ME_QUERY)

/** Возвращает промис; ошибку сервера ловит вызывающая фича. */
export function useUpdateProfile() {
  const [update] = useMutation(UPDATE_PROFILE)
  return (input: UpdateProfileInput) => update({ variables: { input } })
}
