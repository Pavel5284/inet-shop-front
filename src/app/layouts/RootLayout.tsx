import { Box, Button, Container, Typography } from '@mui/material'
import { Outlet, ScrollRestoration, useRouteError } from 'react-router'
import { LogoutGuard } from '@/features/logout'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

export function RootLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LogoutGuard />
      <Header />
      <Box component="main" sx={{ flex: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />
      <ScrollRestoration />
    </Box>
  )
}

/** Показывается, если в приложении произошла непредвиденная ошибка (вместо белого экрана). */
export function RouteError() {
  const error = useRouteError()
  console.error(error)
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography role="alert" variant="h6" gutterBottom>
        Произошла непредвиденная ошибка. Попробуйте обновить страницу.
      </Typography>
      <Button variant="outlined" onClick={() => window.location.reload()}>
        Повторить
      </Button>
    </Container>
  )
}
