import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { sessionActions } from '@/entities/session'
import { paths } from '@/shared/config'

/**
 * Живёт в корневом layout'е (не размонтируется при смене страниц) и снимает флаг выхода
 * только после того, как навигация на главную действительно зафиксирована.
 */
export function LogoutGuard() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === paths.home) sessionActions.endLogout()
  }, [location.pathname])

  return null
}
