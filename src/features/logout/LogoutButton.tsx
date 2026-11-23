import { Logout } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useLogout } from './useLogout'

export function LogoutButton() {
  const logout = useLogout()
  return (
    <Button variant="outlined" startIcon={<Logout />} onClick={logout}>
      Выйти
    </Button>
  )
}
