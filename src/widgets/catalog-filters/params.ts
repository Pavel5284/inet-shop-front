import type { ProductSort, ProductsVariables } from '@/entities/product'

/** Состояние каталога целиком хранится в адресной строке: ?category=…&q=…&sort=…&minPrice=…&maxPrice=…&inStock=1&page=2 */
export const PAGE_SIZE = 20
const SORTS: ProductSort[] = ['POPULAR', 'PRICE_ASC', 'PRICE_DESC', 'RATING', 'NEWEST']

const toInt = (v: string | null) => {
  if (v === null || v === '') return undefined
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

export function parseCatalogParams(params: URLSearchParams): Required<Pick<ProductsVariables, 'sort' | 'page' | 'pageSize'>> & { filter: NonNullable<ProductsVariables['filter']> } {
  const sort = params.get('sort') as ProductSort | null
  return {
    filter: {
      categorySlug: params.get('category') ?? undefined,
      search: params.get('q') ?? undefined,
      minPrice: toInt(params.get('minPrice')),
      maxPrice: toInt(params.get('maxPrice')),
      inStock: params.get('inStock') === '1' ? true : undefined,
    },
    sort: sort && SORTS.includes(sort) ? sort : 'POPULAR',
    page: Math.max(1, toInt(params.get('page')) ?? 1),
    pageSize: PAGE_SIZE,
  }
}
