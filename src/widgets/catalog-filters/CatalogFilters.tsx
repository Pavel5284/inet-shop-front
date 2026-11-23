import { Button, Checkbox, FormControlLabel, ListItemIcon, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { createElement } from 'react'
import { useSearchParams } from 'react-router'
import { categoryIcon, useCategories } from '@/entities/category'
import { SORT_OPTIONS } from '@/entities/product'

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
    ...(data?.categories.map((category) => ({ value: category.slug, label: category.name })) ?? []),
  ]

  return (
    <Paper component="section" aria-label="Фильтры" sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Фильтры
      </Typography>
      <TextField
        select
        label="Категория" id="category"
        value={params.get('category') ?? ''}
        onChange={(e) => change('category', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {categoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>{createElement(categoryIcon(option.value), { fontSize: 'small', color: 'primary' })}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField label="Цена от" id="minPrice" type="number" value={params.get('minPrice') ?? ''} onChange={(e) => change('minPrice', e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Цена до" id="maxPrice" type="number" value={params.get('maxPrice') ?? ''} onChange={(e) => change('maxPrice', e.target.value)} fullWidth sx={{ mb: 1 }} />
      <FormControlLabel
        control={<Checkbox checked={params.get('inStock') === '1'} onChange={(e) => change('inStock', e.target.checked ? '1' : undefined)} />}
        label="Только в наличии"
      />
      <Button size="small" onClick={reset} sx={{ mt: 1 }}>
        Сбросить фильтры
      </Button>
    </Paper>
  )
}

/** Сортировка каталога — тоже часть URL. */
export function CatalogSort() {
  const { params, change } = useChangeParam()
  return (
    <TextField
      select
      label="Сортировка" id="sort"
      value={params.get('sort') ?? 'POPULAR'}
      onChange={(e) => change('sort', e.target.value)}
      sx={{ minWidth: 200 }}
    >
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
