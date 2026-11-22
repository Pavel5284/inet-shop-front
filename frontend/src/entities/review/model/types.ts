export interface Review {
  id: string
  authorName: string
  rating: number
  text: string
  createdAt: string
}

export interface CreateReviewInput {
  productId: string
  rating: number
  text: string
}
