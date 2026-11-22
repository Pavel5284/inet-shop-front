import { createBrowserRouter } from 'react-router'
import { PageLoader } from '@/shared/ui'
import { RootLayout, RouteError } from '../layouts/RootLayout'
import { RequireAuth } from './RequireAuth'

/**
 * Страницы подгружаются лениво (code splitting): браузер скачивает код страницы только когда на неё заходят.
 * Каждая страница импортируется через публичный API слайса (pages/<имя>/index.ts).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: PageLoader, // индикатор, пока грузится код первой страницы
    children: [
      { index: true, lazy: async () => ({ Component: (await import('@/pages/home')).HomePage }) },
      { path: 'catalog', lazy: async () => ({ Component: (await import('@/pages/catalog')).CatalogPage }) },
      { path: 'product/:slug', lazy: async () => ({ Component: (await import('@/pages/product')).ProductPage }) },
      { path: 'login', lazy: async () => ({ Component: (await import('@/pages/login')).LoginPage }) },
      { path: 'register', lazy: async () => ({ Component: (await import('@/pages/register')).RegisterPage }) },
      {
        // Всё, что внутри, требует входа в аккаунт
        Component: RequireAuth,
        children: [
          { path: 'cart', lazy: async () => ({ Component: (await import('@/pages/cart')).CartPage }) },
          { path: 'checkout', lazy: async () => ({ Component: (await import('@/pages/checkout')).CheckoutPage }) },
          { path: 'orders', lazy: async () => ({ Component: (await import('@/pages/orders')).OrdersPage }) },
          { path: 'orders/:id', lazy: async () => ({ Component: (await import('@/pages/order')).OrderPage }) },
          { path: 'favorites', lazy: async () => ({ Component: (await import('@/pages/favorites')).FavoritesPage }) },
          { path: 'profile', lazy: async () => ({ Component: (await import('@/pages/profile')).ProfilePage }) },
        ],
      },
      { path: '*', lazy: async () => ({ Component: (await import('@/pages/not-found')).NotFoundPage }) },
    ],
  },
])
