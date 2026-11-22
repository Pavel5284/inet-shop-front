import { Card, Typography } from '@mui/material'
import { createElement } from 'react'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/shared/config'
import { categoryIcon } from '../model/category-icons'
import type { Category } from '../model/types'

/** Плитка категории на главной странице. */
export function CategoryTile({ category }: { category: Category }) {
  return (
    <Card
      component={RouterLink}
      to={`${paths.catalog}?category=${encodeURIComponent(category.slug)}`}
      sx={{ p: 2, textAlign: 'center', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 0.5 }}
    >
      {createElement(categoryIcon(category.slug), { color: 'primary', fontSize: 'large', 'aria-hidden': true })}
      <Typography variant="body2" color="text.primary">
        {category.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {category.productsCount} товаров
      </Typography>
    </Card>
  )
}
