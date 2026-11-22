import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

/** Ограничивает ширину контента и задаёт боковые отступы. */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto w-full max-w-6xl px-3 sm:px-4', className)} {...rest} />
}
