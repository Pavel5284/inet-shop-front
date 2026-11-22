import { useNavigate } from 'react-router'
import { sessionActions } from '@/entities/session'
import { apolloClient } from '@/shared/api'
import { paths } from '@/shared/config'

/** Полный выход: стереть токен и пользователя, очистить кэш Apollo, вернуться на главную. */
export function useLogout() {
  const navigate = useNavigate()
  return () => {
    // Флаг выхода не даёт RequireAuth редиректить на /login, пока идёт переход на главную
    // (в т.ч. ожидание lazy-загрузки страницы). RequireAuth сам сбросит флаг после редиректа.
    sessionActions.beginLogout()
    sessionActions.clear()
    void apolloClient.clearStore()
    navigate(paths.home, { replace: true })
  }
}
