import { APP_NAME } from '@/shared/config'
import { Container } from '@/shared/ui'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-sm text-slate-500">
      <Container className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span>© {YEAR} {APP_NAME}. Все права защищены.</span>
        <span>Интернет-магазин для всей семьи</span>
      </Container>
    </footer>
  )
}
