import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { useMemo } from 'react'

const FAVORITE_IDS_QUERY: TypedDocumentNode<{ favoriteIds: string[] }, Record<string, never>> = gql`
  query FavoriteIds {
    favoriteIds
  }
`

const TOGGLE_FAVORITE: TypedDocumentNode<{ toggleFavorite: boolean }, { productId: string }> = gql`
  mutation ToggleFavorite($productId: ID!) {
    toggleFavorite(productId: $productId)
  }
`

/** ID избранных товаров в виде Set — для быстрой проверки сердечек в каталоге. */
export const useFavoriteIds = (options: { skip?: boolean } = {}): Set<string> => {
  const { data } = useQuery(FAVORITE_IDS_QUERY, { skip: options.skip, fetchPolicy: 'cache-first' })
  return useMemo(() => new Set(data?.favoriteIds ?? []), [data?.favoriteIds])
}

/** Переключает избранное и обновляет оба списка (ID и товары). */
export function useToggleFavorite() {
  const [toggle] = useMutation(TOGGLE_FAVORITE, { refetchQueries: ['FavoriteIds', 'FavoriteProducts'] })
  return (productId: string) => toggle({ variables: { productId } })
}
