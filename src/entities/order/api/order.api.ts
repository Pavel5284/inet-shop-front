import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import type { CreateOrderInput, Order } from '../model/types'

const ORDER_FIELDS = gql`
  fragment OrderFields on Order {
    id
    number
    status
    createdAt
    totalPrice
    recipientName
    phone
    address
    comment
    paymentMethod
    items {
      id
      title
      quantity
      price
      lineTotal
      image
      productId
      productSlug
    }
  }
`

const ORDERS_QUERY: TypedDocumentNode<{ orders: Order[] }, Record<string, never>> = gql`
  query Orders {
    orders {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`

const ORDER_QUERY: TypedDocumentNode<{ order: Order }, { id: string }> = gql`
  query Order($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`

const CREATE_ORDER: TypedDocumentNode<{ createOrder: Order }, { input: CreateOrderInput }> = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`

const PAY_ORDER: TypedDocumentNode<{ payOrder: Order }, { id: string }> = gql`
  mutation PayOrder($id: ID!) {
    payOrder(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`

const CANCEL_ORDER: TypedDocumentNode<{ cancelOrder: Order }, { id: string }> = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`

export const useOrders = () => useQuery(ORDERS_QUERY)

export const useOrder = (id: string) => useQuery(ORDER_QUERY, { variables: { id }, skip: !id })

export function useCreateOrder() {
  const [create] = useMutation(CREATE_ORDER, { refetchQueries: ['Cart', 'Orders'] })
  return async (input: CreateOrderInput): Promise<Order> => {
    const { data } = await create({ variables: { input } })
    if (!data) throw new Error('Не удалось оформить заказ')
    return data.createOrder
  }
}

const ORDER_REFETCH = ['Orders', 'Order']

export function usePayOrder() {
  const [pay] = useMutation(PAY_ORDER, { refetchQueries: ORDER_REFETCH })
  return (id: string) => pay({ variables: { id } })
}

export function useCancelOrder() {
  const [cancel] = useMutation(CANCEL_ORDER, { refetchQueries: ORDER_REFETCH })
  return (id: string) => cancel({ variables: { id } })
}
