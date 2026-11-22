import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useCategories } from '@/entities/category'
import { SORT_OPTIONS } from '@/entities/product'
import { Button, Input, Select } from '@/shared/ui'

function useChangeParam() {
  const [params, setParams] = useSearchParams()
  const change = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }
  return { params, change, reset: () => setParams(new URLSearchParams()) }
}

/** Фильтры каталога: всё состояние живёт в URL, смена фильтра сбрасывает страницу. */
export function CatalogFilters() {
  const { params, change, reset } = useChangeParam()
  const { data } = useCategories()
  const categoryOptions = [
    { value: '', label: 'Все категории' },
    ...(data?.categories.map((c) => ({ value: c.slug, label: `${c.icon} ${c.name}` })) ?? []),
  ]

  return (
    <section aria-label="Фильтры" className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <SlidersHorizontal className="size-4" />
        Фильтры
      </h2>
      <Select label="Категория" options={categoryOptions} value={params.get('category') ?? ''} onChange={(e) => change('category', e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Цена от" type="number" min={0} value={params.get('minPrice') ?? ''} onChange={(e) => change('minPrice', e.target.value)} />
        <Input label="Цена до" type="number" min={0} value={params.get('maxPrice') ?? ''} onChange={(e) => change('maxPrice', e.target.value)} />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={params.get('inStock') === '1'}
          onChange={(e) => change('inStock', e.target.checked ? '1' : undefined)}
          className="size-4 accent-brand"
        />
        Только в наличии
      </label>
      <Button variant="ghost" size="sm" onClick={reset}>
        Сбросить фильтры
      </Button>
    </section>
  )
}

/** Сортировка каталога — тоже часть URL. */
export function CatalogSort() {
  const { params, change } = useChangeParam()
  return (
    <Select
      label="Сортировка"
      options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
      value={params.get('sort') ?? 'POPULAR'}
      onChange={(e) => change('sort', e.target.value)}
      className="min-w-48"
    />
  )
}
