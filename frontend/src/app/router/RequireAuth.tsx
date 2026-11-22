import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated } from '@/entities/session'
import { paths } from '@/shared/config'
import type { AuthRedirectState } from '@/shared/lib'

/** Layout-маршрут: пускает дальше только авторизованных, остальных отправляет на вход и потом возвращает назад. */
export function RequireAuth() {
  const isAuth = useIsAuthenticated()
  const location = useLocation()
  if (!isAuth) {
    const state: AuthRedirectState = { from: location, reason: 'Войдите, чтобы продолжить' }
    return <Navigate to={paths.login} state={state} replace />
  }
  return <Outlet />
}
