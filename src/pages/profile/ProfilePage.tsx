import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { useMe } from '@/entities/user'
import { ProfileForm } from '@/features/edit-profile'
import { LogoutButton } from '@/features/logout'
import { usePageTitle } from '@/shared/lib'

export function ProfilePage() {
  usePageTitle('Профиль')
  const { data, loading, error, refetch } = useMe()
  const user = data?.me

  if (!user) {
    return loading ? (
      <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
    ) : (
      <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
        {error ? 'Не удалось загрузить профиль' : 'Профиль недоступен'}
      </Alert>
    )
  }

  return (
    <Box sx={{ maxWidth: 672, mx: 'auto', display: 'grid', gap: 2.5 }}>
      <Typography component="h1" variant="h4">
        Профиль
      </Typography>
      <ProfileForm me={user} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LogoutButton />
      </Box>
    </Box>
  )
}
