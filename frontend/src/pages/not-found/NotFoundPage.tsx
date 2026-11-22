import { Link } from 'react-router'
import { paths } from '@/shared/config'
import { usePageTitle } from '@/shared/lib'
import { buttonClasses, EmptyState } from '@/shared/ui'

export function NotFoundPage() {
  usePageTitle('404')
  return (
    <EmptyState
      title="404 — страница не найдена"
      description="Возможно, адрес устарел или товар был удалён."
      action={
        <Link to={paths.home} className={buttonClasses()}>
          На главную
        </Link>
      }
    />
  )
}
