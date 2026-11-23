import { AutoStories, Category, Checkroom, ChildCare, Devices, DirectionsWalk, Home, Spa, SportsSoccer } from '@mui/icons-material'

const ICONS = {
  electronics: Devices,
  clothes: Checkroom,
  shoes: DirectionsWalk,
  home: Home,
  beauty: Spa,
  sport: SportsSoccer,
  kids: ChildCare,
  books: AutoStories,
}

/** Иконка Material UI для категории по её slug (вместо эмодзи из бэкенда). */
export function categoryIcon(slug: string) {
  return ICONS[slug as keyof typeof ICONS] ?? Category
}
