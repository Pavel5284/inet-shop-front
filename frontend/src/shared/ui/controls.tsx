import clsx from 'clsx'
import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  min?: number
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
}

/** Счётчик количества с доступными названиями кнопок. */
export function QuantityStepper({ value, min = 1, max = 20, disabled = false, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white">
      <button
        type="button"
        aria-label="Уменьшить"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-9 items-center justify-center rounded-l-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Увеличить"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-9 items-center justify-center rounded-r-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Пагинация" className="flex justify-center pt-2">
      <ul className="flex flex-wrap gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <button
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
              className={clsx(
                'size-9 rounded-xl text-sm font-semibold transition-colors',
                p === page ? 'bg-brand text-white' : 'bg-white text-slate-700 hover:bg-brand-light hover:text-brand',
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
