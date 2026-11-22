import { Favorite, Inventory2, Login, ShoppingCart, Storefront, Person } from '@mui/icons-material'
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link as RouterLink, NavLink } from 'react-router'
import { useCart } from '@/entities/cart'
import { useCategories } from '@/entities/category'
import { useIsAuthenticated, useSessionUser } from '@/entities/session'
import { SearchBar } from '@/features/search-products'
import { APP_NAME, paths } from '@/shared/config'

interface NavItemProps {
  to: string
  icon: ReactNode
  label: string
  badge?: number
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <Button
      component={NavLink}
      to={to}
      aria-label={badge ? `${label}, товаров: ${badge}` : label}
      sx={{ display: 'flex', flexDirection: 'column', minWidth: 56, py: 0.5, color: 'text.secondary' }}
    >
      <Badge badgeContent={badge} color="error">
        {icon}
      </Badge>
      <Typography variant="caption">{label}</Typography>
    </Button>
  )
}

export function Header() {
  const isAuth = useIsAuthenticated()
  const user = useSessionUser()
  const { data: cartData } = useCart({ skip: !isAuth })
  const { data: categoriesData } = useCategories()

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Button component={RouterLink} to={paths.home} startIcon={<Storefront />} sx={{ color: 'primary.main', fontWeight: 800, fontSize: 20, textTransform: 'none' }}>
            {APP_NAME}
          </Button>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SearchBar />
          </Box>
          <Box component="nav" aria-label="Основное меню" sx={{ display: 'flex', flexShrink: 0 }}>
            {isAuth ? (
              <>
                <NavItem to={paths.profile} icon={<Person />} label={user?.firstName ?? 'Профиль'} />
                <NavItem to={paths.orders} icon={<Inventory2 />} label="Заказы" />
                <NavItem to={paths.favorites} icon={<Favorite />} label="Избранное" />
              </>
            ) : (
              <NavItem to={paths.login} icon={<Login />} label="Войти" />
            )}
            <NavItem to={paths.cart} icon={<ShoppingCart />} label="Корзина" badge={cartData?.cart.totalCount} />
          </Box>
        </Toolbar>
      </Container>
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box component="ul" sx={{ display: 'flex', gap: 0.5, listStyle: 'none', m: 0, p: 1, overflowX: 'auto' }}>
            <Box component="li">
              <Button component={RouterLink} to={paths.catalog} size="small" sx={{ whiteSpace: 'nowrap' }}>
                Все товары
              </Button>
            </Box>
            {categoriesData?.categories.map((category) => (
              <Box component="li" key={category.id}>
                <Button component={RouterLink} to={`${paths.catalog}?category=${category.slug}`} size="small" color="inherit" sx={{ whiteSpace: 'nowrap' }}>
                  {category.icon} {category.name}
                </Button>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </AppBar>
  )
}
