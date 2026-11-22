import { useParams } from 'react-router'
import { AddToCartButton } from '@/features/add-to-cart'
import { FavoriteButton } from '@/features/toggle-favorite'
import { useProduct, useProducts, Price } from '@/entities/product'
import { usePageTitle } from '@/shared/lib'
import { ErrorState, PageLoader, RatingStars, SafeImage } from '@/shared/ui'
import { ProductGrid } from '@/widgets/product-grid'
import { ProductReviews } from '@/widgets/product-reviews'

export function ProductPage() {
  usePageTitle('Товар')
  const { slug = '' } = useParams()
  const { data, loading, error, refetch } = useProduct(slug)
  const product = data?.product
  const related = useProducts({
    filter: { categorySlug: product?.category.slug },
    page: 1,
    pageSize: 6,
    sort: 'POPULAR',
  })

  if (!product) {
    return loading ? (
      <PageLoader />
    ) : (
      <ErrorState
        message={error ? 'Товар не найден' : 'Не удалось загрузить товар'}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <SafeImage src={product.images[0]} alt={product.title} className="aspect-square w-full rounded-xl" />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.slice(1).map((image) => (
              <SafeImage key={image} src={image} alt="" className="size-16 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-400">{product.brand}</p>
          <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <RatingStars rating={product.rating} />
            <span>{product.rating.toFixed(1)}</span>
            <span>{product.reviewsCount} отзывов</span>
          </div>
          <Price price={product.price} oldPrice={product.oldPrice} className="text-2xl" />
          <p className="text-sm text-slate-500">
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {product.stock > 0 && <div className="min-w-56"><AddToCartButton product={product} size="lg" /></div>}
            <FavoriteButton productId={product.id} className="size-11 border border-slate-200" />
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-3 text-xl font-bold">Описание</h2>
        <p className="leading-7 text-slate-700">{product.description}</p>
      </section>

      <ProductReviews productId={product.id} />

      <section>
        <h2 className="mb-4 text-xl font-bold">Похожие товары</h2>
        <ProductGrid
          products={related.data?.products.items.filter((p) => p.id !== product.id)}
          loading={related.loading && !related.data}
          skeletons={5}
        />
      </section>
    </div>
  )
}
