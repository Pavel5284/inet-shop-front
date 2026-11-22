import { useNavigate } from 'react-router'
import { sessionActions } from '@/entities/session'
import { apolloClient } from '@/shared/api'
import { paths } from '@/shared/config'

/** Полный выход: стереть токен и пользователя, очистить кэш Apollo, вернуться на главную. */
export function useLogout() {
  const navigate = useNavigate()
  return async () => {
    // Сначала дожидаемся навигации с защищённой страницы: иначе RequireAuth увидит пустую
    // сессию ещё на /profile и успеет редиректить на /login раньше перехода на главную.
    await navigate(paths.home, { replace: true })
    sessionActions.clear()
    void apolloClient.clearStore()
  }
}
