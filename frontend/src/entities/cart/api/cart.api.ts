import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import type { Cart } from '../model/types'

const CART_FIELDS = gql`
  fragment CartFields on Cart {
    totalCount
    totalPrice
    totalDiscount
    items {
      id
      quantity
      lineTotal
      product {
        id
        slug
        title
        price
        oldPrice
        images
        stock
      }
    }
  }
`

export const CART_QUERY: TypedDocumentNode<{ cart: Cart }, Record<string, never>> = gql`
  query Cart {
    cart {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`

const ADD_TO_CART: TypedDocumentNode<{ addToCart: Cart }, { productId: string; quantity: number }> = gql`
  mutation AddToCart($productId: ID!, $quantity: Int = 1) {
    addToCart(productId: $productId, quantity: $quantity) {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`

const SET_QUANTITY: TypedDocumentNode<{ setCartItemQuantity: Cart }, { productId: string; quantity: number }> = gql`
  mutation SetCartItemQuantity($productId: ID!, $quantity: Int!) {
    setCartItemQuantity(productId: $productId, quantity: $quantity) {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`

const REMOVE_FROM_CART: TypedDocumentNode<{ removeFromCart: Cart }, { productId: string }> = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`

const CLEAR_CART: TypedDocumentNode<{ clearCart: Cart }, Record<string, never>> = gql`
  mutation ClearCart {
    clearCart {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`

/**
 * skip=true — для гостей: запрос не отправляется.
 * fresh=true — всегда сверяться с сервером (страница корзины); иначе берём из кэша, который обновляют мутации.
 */
export const useCart = (options: { skip?: boolean; fresh?: boolean } = {}) =>
  useQuery(CART_QUERY, { skip: options.skip, fetchPolicy: options.fresh ? 'cache-and-network' : 'cache-first' })

/**
 * Действия с корзиной. Каждая функция возвращает промис и бросает ошибку, если сервер её вернул
 * (например, «Товара нет в наличии») — ловите через try/catch + getErrorMessage.
 * Корзина в кэше обновляется автоматически (см. typePolicies.Cart в shared/api).
 */
export function useCartActions() {
  const [add, addState] = useMutation(ADD_TO_CART)
  const [setQty, setQtyState] = useMutation(SET_QUANTITY)
  const [remove, removeState] = useMutation(REMOVE_FROM_CART)
  const [clear, clearState] = useMutation(CLEAR_CART)

  return {
    addToCart: (productId: string, quantity = 1) => add({ variables: { productId, quantity } }),
    setQuantity: (productId: string, quantity: number) => setQty({ variables: { productId, quantity } }),
    removeFromCart: (productId: string) => remove({ variables: { productId } }),
    clearCart: () => clear(),
    pending: addState.loading || setQtyState.loading || removeState.loading || clearState.loading,
  }
}
