import clsx from 'clsx'
import { Star } from 'lucide-react'
import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#e2e8f0"/><path d="M120 250l60-60 45 45 55-70" fill="none" stroke="#94a3b8" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="140" r="22" fill="#94a3b8"/></svg>',
  )

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
}

/** Картинка с запасным вариантом: внешние изображения в тестовых данных могут быть недоступны. */
export function SafeImage({ src, alt, className, ...rest }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const broken = !src || failedSrc === src
  return (
    <img
      src={broken ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      className={clsx('object-cover', className)}
      onError={() => setFailedSrc(src ?? null)}
      {...rest}
    />
  )
}

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-0.5', className)} aria-label={`Рейтинг ${rating.toFixed(1)} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={clsx('size-4', i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300')}
        />
      ))}
    </span>
  )
}
