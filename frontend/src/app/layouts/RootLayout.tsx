import { Outlet, ScrollRestoration, useRouteError } from 'react-router'
import { LogoutGuard } from '@/features/logout'
import { Container, ErrorState } from '@/shared/ui'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LogoutGuard />
      <Header />
      <main className="flex-1 py-6">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}

/** Показывается, если в приложении произошла непредвиденная ошибка (вместо белого экрана). */
export function RouteError() {
  const error = useRouteError()
  console.error(error)
  return (
    <Container className="py-20">
      <ErrorState message="Произошла непредвиденная ошибка. Попробуйте обновить страницу." onRetry={() => window.location.reload()} />
    </Container>
  )
}
