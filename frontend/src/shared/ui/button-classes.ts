import clsx from 'clsx'

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark disabled:bg-slate-300',
  secondary: 'bg-brand-light text-brand hover:bg-blue-100 disabled:opacity-50',
  outline: 'border border-slate-300 bg-white text-slate-800 hover:border-brand hover:text-brand disabled:opacity-50',
  ghost: 'text-slate-700 hover:bg-slate-100 disabled:opacity-50',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

/** Классы кнопки — можно применять и к ссылкам: <Link className={buttonClasses()}> */
export const buttonClasses = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: { variant?: Variant; size?: Size; fullWidth?: boolean } = {}) =>
  clsx(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
    'disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
  )
