/** Урезанный тип товара в корзине: сущность cart не зависит от сущности product. */
export interface CartProduct {
  id: string
  slug: string
  title: string
  price: number
  oldPrice: number | null
  images: string[]
  stock: number
}

export interface CartItem {
  id: string
  quantity: number
  lineTotal: number
  product: CartProduct
}

export interface Cart {
  items: CartItem[]
  totalCount: number
  totalDiscount: number
  totalPrice: number
}
