import { MessageSquare } from 'lucide-react'
import { ReviewItem, useReviews } from '@/entities/review'
import { useIsAuthenticated } from '@/entities/session'
import { ReviewForm } from '@/features/create-review'
import { getErrorMessage } from '@/shared/lib'
import { EmptyState, ErrorState, PageLoader } from '@/shared/ui'

/** Блок отзывов товара: список, форма для вошедших и все состояния загрузки. */
export function ProductReviews({ productId }: { productId: string }) {
  const { data, loading, error, refetch } = useReviews(productId)
  const isAuth = useIsAuthenticated()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Отзывы ({data?.reviews.length ?? 0})</h2>
      {isAuth && <ReviewForm productId={productId} />}

      {!data ? (
        loading ? (
          <PageLoader />
        ) : (
          <ErrorState message={error ? getErrorMessage(error) : 'Не удалось загрузить отзывы'} onRetry={() => void refetch()} />
        )
      ) : data.reviews.length === 0 ? (
        <EmptyState icon={<MessageSquare className="size-8" />} title="Отзывов пока нет" description="Станьте первым, кто оставит отзыв о товаре." />
      ) : (
        <ul className="space-y-3">
          {data.reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}
    </section>
  )
}
