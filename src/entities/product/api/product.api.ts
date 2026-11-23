import { gql, type TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { Product, ProductDetails, ProductsPage, ProductsVariables } from '../model/types'

/** Общие поля карточки товара: используются в каталоге, избранном и на странице товара. */
export const PRODUCT_CARD_FIELDS = gql`
  fragment ProductCardFields on Product {
    id
    slug
    title
    brand
    description
    categoryId
    category {
      id
      name
      slug
      icon
    }
    price
    oldPrice
    discountPercent
    rating
    reviewsCount
    images
    stock
    createdAt
  }
`

const PRODUCTS_QUERY: TypedDocumentNode<{ products: ProductsPage }, ProductsVariables> = gql`
  query Products($filter: ProductsFilterInput, $page: Int! = 1, $pageSize: Int! = 20, $sort: ProductSort! = POPULAR) {
    products(filter: $filter, page: $page, pageSize: $pageSize, sort: $sort) {
      items {
        ...ProductCardFields
      }
      page
      pageSize
      total
      totalPages
    }
  }
  ${PRODUCT_CARD_FIELDS}
`

const PRODUCT_QUERY: TypedDocumentNode<{ product: ProductDetails }, { slug: string }> = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      ...ProductCardFields
    }
  }
  ${PRODUCT_CARD_FIELDS}
`

const FAVORITE_PRODUCTS_QUERY: TypedDocumentNode<{ favorites: Product[] }, Record<string, never>> = gql`
  query FavoriteProducts {
    favorites {
      ...ProductCardFields
    }
  }
  ${PRODUCT_CARD_FIELDS}
`

export const useProducts = (variables: ProductsVariables) => useQuery(PRODUCTS_QUERY, { variables })

export const useProduct = (slug: string) => useQuery(PRODUCT_QUERY, { variables: { slug }, skip: !slug })

export const useFavoriteProducts = () => useQuery(FAVORITE_PRODUCTS_QUERY)
