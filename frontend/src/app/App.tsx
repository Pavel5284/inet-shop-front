import { RouterProvider } from 'react-router/dom'
import { sessionActions } from '@/entities/session'
import { apolloClient, setUnauthorizedHandler } from '@/shared/api'
import { AppProviders } from './providers/AppProviders'
import { router } from './router'

// Если сервер сказал «токен недействителен» — выходим из аккаунта и чистим кэш.
// RequireAuth сам отправит пользователя на страницу входа.
setUnauthorizedHandler(() => {
  sessionActions.clear()
  void apolloClient.clearStore()
})

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
