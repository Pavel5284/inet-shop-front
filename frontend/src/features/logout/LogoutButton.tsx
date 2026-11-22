import { LogOut } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useLogout } from './useLogout'

export function LogoutButton() {
  const logout = useLogout()
  return (
    <Button variant="outline" onClick={logout}>
      <LogOut className="size-4" />
      Выйти
    </Button>
  )
}
