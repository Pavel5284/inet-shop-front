import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated, useSessionStore } from '@/entities/session'
import { paths } from '@/shared/config'
import type { AuthRedirectState } from '@/shared/lib'

/** Layout-маршрут: пускает дальше только авторизованных, остальных отправляет на вход и потом возвращает назад. */
export function RequireAuth() {
  const isAuth = useIsAuthenticated()
  const loggingOut = useSessionStore((s) => s.loggingOut)
  const location = useLocation()

  if (!isAuth) {
    // При выходе уходим на главную, а не на страницу входа; флаг снимает LogoutGuard.
    if (loggingOut) return <Navigate to={paths.home} replace />
    const state: AuthRedirectState = { from: location, reason: 'Войдите, чтобы продолжить' }
    return <Navigate to={paths.login} state={state} replace />
  }
  return <Outlet />
}
