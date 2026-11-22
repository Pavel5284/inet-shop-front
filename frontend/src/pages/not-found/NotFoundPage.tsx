import { Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/shared/config'
import { usePageTitle } from '@/shared/lib'

export function NotFoundPage() {
  usePageTitle('404')
  return (
    <Paper sx={{ p: 6, textAlign: 'center' }}>
      <Typography component="h1" variant="h3">
        404 — страница не найдена
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Возможно, адрес устарел или товар был удалён.
      </Typography>
      <Button component={RouterLink} to={paths.home} variant="contained" sx={{ mt: 2 }}>
        На главную
      </Button>
    </Paper>
  )
}
