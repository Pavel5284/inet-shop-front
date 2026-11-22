import clsx from 'clsx'
import { Heart, LogIn, Package, ShoppingCart, Store, User } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { useCart } from '@/entities/cart'
import { useCategories } from '@/entities/category'
import { useIsAuthenticated, useSessionUser } from '@/entities/session'
import { SearchBar } from '@/features/search-products'
import { APP_NAME, paths } from '@/shared/config'
import { Container } from '@/shared/ui'

function NavItem({ to, icon: Icon, label, badge }: { to: string; icon: typeof User; label: string; badge?: number }) {
  return (
    <NavLink
      to={to}
      // Подпись скрыта на узких экранах, поэтому задаём доступное имя явно (для скринридеров и тестов)
      aria-label={badge ? `${label}, товаров: ${badge}` : label}
      className={({ isActive }) =>
        clsx('relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors hover:bg-slate-100', isActive ? 'text-brand' : 'text-slate-600')
      }
    >
      <Icon className="size-6" />
      <span className="hidden sm:block">{label}</span>
      {badge ? (
        <span className="absolute right-1 top-0 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-5 text-white">{badge}</span>
      ) : null}
    </NavLink>
  )
}

export function Header() {
  const isAuth = useIsAuthenticated()
  const user = useSessionUser()
  const { data: cartData } = useCart({ skip: !isAuth })
  const { data: categoriesData } = useCategories()

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <Container className="flex items-center gap-3 py-2 sm:gap-6">
        <Link to={paths.home} className="flex shrink-0 items-center gap-2 text-xl font-extrabold text-brand">
          <Store className="size-7" />
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <nav className="flex shrink-0 items-center" aria-label="Основное меню">
          {isAuth ? (
            <>
              <NavItem to={paths.profile} icon={User} label={user?.firstName ?? 'Профиль'} />
              <NavItem to={paths.orders} icon={Package} label="Заказы" />
              <NavItem to={paths.favorites} icon={Heart} label="Избранное" />
            </>
          ) : (
            <NavItem to={paths.login} icon={LogIn} label="Войти" />
          )}
          <NavItem to={paths.cart} icon={ShoppingCart} label="Корзина" badge={cartData?.cart.totalCount} />
        </nav>
      </Container>

      <div className="border-t border-slate-100">
        <Container>
          <ul className="flex gap-1 overflow-x-auto py-1.5 text-sm [scrollbar-width:none]">
            <li>
              <Link to={paths.catalog} className="block whitespace-nowrap rounded-lg px-3 py-1 font-semibold text-brand hover:bg-brand-light">
                Все товары
              </Link>
            </li>
            {categoriesData?.categories.map((c) => (
              <li key={c.id}>
                <Link to={`${paths.catalog}?category=${c.slug}`} className="block whitespace-nowrap rounded-lg px-3 py-1 text-slate-700 hover:bg-slate-100">
                  {c.icon} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  )
}
