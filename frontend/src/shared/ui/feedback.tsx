import clsx from 'clsx'
import { LoaderCircle, PackageOpen, RefreshCw, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

export function Spinner() {
  return <LoaderCircle className="size-6 animate-spin text-brand" />
}

export function PageLoader() {
  return (
    <div role="status" aria-label="Загрузка" className="flex min-h-48 items-center justify-center">
      <Spinner />
    </div>
  )
}

interface AlertProps {
  children: ReactNode
  tone?: 'error' | 'info' | 'success'
  className?: string
}

export function Alert({ children, tone = 'error', className }: AlertProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx(
        'rounded-xl px-3 py-2 text-sm',
        tone === 'error' && 'bg-red-50 text-red-700',
        tone === 'info' && 'bg-brand-light text-brand',
        tone === 'success' && 'bg-emerald-50 text-emerald-700',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center">
      <TriangleAlert className="size-8 text-red-500" />
      <p className="text-slate-700">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Повторить
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center">
      <div className="text-slate-400">{icon ?? <PackageOpen className="size-8" />}</div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
