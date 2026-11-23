export type OrderStatus = 'NEW' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentMethod = 'CARD' | 'CASH'

export interface OrderItem {
  id: string
  title: string
  quantity: number
  price: number
  lineTotal: number
  image: string | null
  productId: string | null
  productSlug: string | null
}

export interface Order {
  id: string
  number: number
  status: OrderStatus
  createdAt: string
  totalPrice: number
  recipientName: string
  phone: string
  address: string
  comment: string | null
  paymentMethod: PaymentMethod
  items: OrderItem[]
}

export interface CreateOrderInput {
  recipientName: string
  phone: string
  address: string
  comment?: string
  paymentMethod: PaymentMethod
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'Новый',
  PAID: 'Оплачен',
  SHIPPED: 'В пути',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CARD: 'Картой онлайн',
  CASH: 'При получении',
}
