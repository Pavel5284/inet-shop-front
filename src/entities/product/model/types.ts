export interface ProductCategory {
  id: string
  name: string
  slug: string
  icon: string
  /** Запрашивается только в отдельном запросе категорий: вложенный резолвер бэкенда его не отдаёт. */
  productsCount?: number
}

export interface Product {
  id: string
  slug: string
  title: string
  brand: string
  description: string
  categoryId: string
  category: ProductCategory
  price: number
  oldPrice: number | null
  discountPercent: number | null
  rating: number
  reviewsCount: number
  images: string[]
  stock: number
  createdAt: string
}

export type ProductDetails = Product

export type ProductSort = 'NEWEST' | 'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'

export interface ProductsFilter {
  categorySlug?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface ProductsVariables {
  filter?: ProductsFilter
  page: number
  pageSize: number
  sort: ProductSort
}

export interface ProductsPage {
  items: Product[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export const SORT_OPTIONS: readonly { value: ProductSort; label: string }[] = [
  { value: 'POPULAR', label: 'По популярности' },
  { value: 'NEWEST', label: 'Сначала новые' },
  { value: 'PRICE_ASC', label: 'Сначала дешёвые' },
  { value: 'PRICE_DESC', label: 'Сначала дорогие' },
  { value: 'RATING', label: 'По рейтингу' },
]
