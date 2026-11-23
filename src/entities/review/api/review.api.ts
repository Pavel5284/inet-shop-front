import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import type { CreateReviewInput, Review } from '../model/types'

const REVIEWS_QUERY: TypedDocumentNode<{ reviews: Review[] }, { productId: string }> = gql`
  query Reviews($productId: ID!) {
    reviews(productId: $productId) {
      id
      authorName
      rating
      text
      createdAt
    }
  }
`

const CREATE_REVIEW: TypedDocumentNode<{ createReview: Review }, { input: CreateReviewInput }> = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      authorName
      rating
      text
      createdAt
    }
  }
`

export const useReviews = (productId: string) => useQuery(REVIEWS_QUERY, { variables: { productId }, skip: !productId })

/** Отзывы и рейтинг товара обновляются после публикации. */
export function useCreateReview() {
  const [create] = useMutation(CREATE_REVIEW, { refetchQueries: ['Reviews', 'Product'] })
  return (input: CreateReviewInput) => create({ variables: { input } })
}
