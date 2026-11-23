/** Все пути приложения в одном месте. */
export const paths = {
  home: '/',
  catalog: '/catalog',
  product: (slug: string) => `/product/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  order: (id: string) => `/orders/${id}`,
  favorites: '/favorites',
  profile: '/profile',
  login: '/login',
  register: '/register',
} as const

/** Шаблоны для описания маршрутов в роутере. */
export const patterns = {
  product: '/product/:slug',
  order: '/orders/:id',
} as const
