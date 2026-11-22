import { Star } from 'lucide-react'
import { formatDate } from '@/shared/lib'
import type { Review } from '../model/types'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-slate-800">{review.authorName}</span>
        <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
      </div>
      <div className="mt-1 flex gap-0.5" aria-label={`Оценка ${review.rating} из 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`size-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        ))}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{review.text}</p>
    </li>
  )
}
