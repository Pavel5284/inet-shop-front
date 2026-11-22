import { gql, type TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { Category } from '../model/types'

const CATEGORIES_QUERY: TypedDocumentNode<{ categories: Category[] }, Record<string, never>> = gql`
  query Categories {
    categories {
      id
      name
      slug
      icon
      productsCount
    }
  }
`

export const useCategories = () => useQuery(CATEGORIES_QUERY)
