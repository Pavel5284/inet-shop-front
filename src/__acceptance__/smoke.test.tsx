/**
 * Приёмочный тест фронтенда. Рендерит настоящее приложение в jsdom и проходит по сценарию
 * против НАСТОЯЩЕГО запущенного бэкенда (свежая БД с seed!).
 * Тексты кнопок и заголовков должны совпадать с теми, что указаны в спецификации.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { App } from '@/app'
import { router } from '@/app/router'

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
const go = (to: string) => act(async () => { await router.navigate(to) })
const opts = { timeout: 15000 }

describe('marketplace smoke flow', () => {
  const user = userEvent.setup()

  it('renders home page with categories and products (guest)', async () => {
    render(<App />)
    await screen.findByRole('heading', { name: 'Популярное' }, opts)
    await waitFor(() => expect(document.querySelectorAll('article').length).toBeGreaterThanOrEqual(10), opts)
    expect((await screen.findAllByRole('link', { name: /Электроника/ }, opts)).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('link', { name: /Войти/ })).toBeTruthy()
  })

  it('catalog: category filter, search, sort', async () => {
    await go('/catalog?category=electronics')
    await screen.findByRole('heading', { name: 'Электроника', level: 1 }, opts)
    await screen.findByText(/Найдено 8 товаров/, {}, opts)
    await go('/catalog?q=смартфон')
    await screen.findByText(/Найдено 2 товара/, {}, opts)
    await go('/catalog?category=books&sort=PRICE_DESC')
    await screen.findByText(/Найдено 8 товаров/, {}, opts)
    expect(document.querySelectorAll('article').length).toBe(8)
  })

  it('product page renders and guest is sent to login on add-to-cart', async () => {
    await go('/catalog?category=electronics&inStock=1')
    const firstLink = await waitFor(() => {
      const a = document.querySelector('article a[href^="/product/"]:not([aria-hidden])') as HTMLAnchorElement
      expect(a).toBeTruthy()
      return a
    }, opts)
    await go(firstLink.getAttribute('href')!)
    await screen.findByRole('heading', { name: /Описание/ }, opts)
    await screen.findByRole('heading', { name: /Отзывы/ }, opts)
    await user.click(screen.getAllByRole('button', { name: 'В корзину' })[0])
    await screen.findByText('Войдите, чтобы добавить товар в корзину', {}, opts)
  })

  it('protected route redirects, demo login returns user to the cart', async () => {
    await go('/cart')
    await screen.findByRole('heading', { name: 'Вход' }, opts)
    await user.click(screen.getByRole('button', { name: 'Войти как демо-пользователь' }))
    await screen.findByRole('heading', { name: 'Корзина', level: 1 }, opts) // вернулись на /cart
    expect(router.state.location.pathname).toBe('/cart')
    await screen.findByText(/Итого/, {}, opts)
    expect(await screen.findByText('3 товара')).toBeTruthy() // в seed-корзине 1 + 2 шт.
    expect(screen.getByText('Демо')).toBeTruthy() // имя в шапке
  })

  it('add product to cart via product card, quantity stepper works', async () => {
    await go('/catalog?category=home&inStock=1')
    const card = await waitFor(() => {
      const el = document.querySelector('article') as HTMLElement
      expect(el).toBeTruthy()
      return el
    }, opts)
    const before = Number(screen.getByRole('link', { name: /Корзина/ }).textContent?.match(/\d+/)?.[0] ?? 0)
    await user.click(within(card).getByRole('button', { name: 'В корзину' }))
    await waitFor(() => expect(within(card).getByRole('button', { name: 'Увеличить' })).toBeTruthy(), opts)
    await user.click(within(card).getByRole('button', { name: 'Увеличить' }))
    await waitFor(() => expect(Number(screen.getByRole('link', { name: /Корзина/ }).textContent?.match(/\d+/)?.[0])).toBe(before + 2), opts)
  })

  it('favorites toggle', async () => {
    await go('/favorites')
    await screen.findByRole('heading', { name: 'Избранное' }, opts)
    await waitFor(() => expect(document.querySelectorAll('article').length).toBe(4), opts)
    await user.click(within(document.querySelector('article') as HTMLElement).getByRole('button', { name: 'Убрать из избранного' }))
    await waitFor(() => expect(document.querySelectorAll('article').length).toBe(3), opts)
  })

  it('checkout creates an order, pay works, cart becomes empty', async () => {
    await go('/checkout')
    await screen.findByRole('heading', { name: 'Оформление заказа' }, opts)
    const recipient = (await screen.findByLabelText('Получатель', {}, opts)) as HTMLInputElement
    expect(recipient.value).toBe('Демо Пользователь')
    await user.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    await screen.findByRole('button', { name: 'Оплатить (тест)' }, opts)
    expect(router.state.location.pathname).toMatch(/^\/orders\/[0-9a-f-]{36}$/)
    await user.click(screen.getByRole('button', { name: 'Оплатить (тест)' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Оплатить (тест)' })).toBeNull(), opts)
    expect(screen.getAllByText('Оплачен').length).toBeGreaterThan(0)
    await go('/cart')
    await screen.findByText('В корзине пока пусто', {}, opts)
  })

  it('orders list shows 4 orders; profile form is prefilled and saves', async () => {
    await go('/orders')
    await screen.findByRole('heading', { name: 'Мои заказы' }, opts)
    await waitFor(() => expect(document.querySelectorAll('ul > li > a[href^="/orders/"]').length).toBe(4), opts)
    await go('/profile')
    const phone = (await screen.findByLabelText('Телефон', {}, opts)) as HTMLInputElement
    expect(phone.value).toBe('+7 900 000-00-00')
    await user.clear(phone)
    await user.type(phone, '+7 999 000-11-22')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    await screen.findByText('Профиль сохранён', {}, opts)
  })

  it('review can be posted on a product', async () => {
    await go('/catalog?category=sport')
    const link = await waitFor(() => {
      const a = document.querySelector('article a[href^="/product/"]:not([aria-hidden])') as HTMLAnchorElement
      expect(a).toBeTruthy()
      return a
    }, opts)
    await go(link.getAttribute('href')!)
    const textarea = await screen.findByPlaceholderText(/Расскажите/, {}, opts)
    await user.type(textarea, 'Очень хороший товар, рекомендую')
    await user.click(screen.getByRole('button', { name: 'Отправить отзыв' }))
    await screen.findByText(/Ваш отзыв опубликован/, {}, opts)
    await screen.findByText('Демо П.', {}, opts)
  })

  it('logout clears session; protected route redirects again', async () => {
    await go('/profile')
    await user.click(await screen.findByRole('button', { name: /Выйти/ }, opts))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'), opts)
    await screen.findByRole('link', { name: /Войти/ }, opts)
    expect(localStorage.getItem('market.token')).toBeNull()
    await go('/orders')
    await screen.findByRole('heading', { name: 'Вход' }, opts)
  })

  it('wrong password shows server error; registration works end to end', async () => {
    await go('/login')
    await user.type(await screen.findByLabelText('Email'), 'demo@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Войти' }))
    await screen.findByText('Неверный email или пароль', {}, opts)

    await go('/register')
    await screen.findByRole('heading', { name: 'Регистрация' }, opts)
    await user.type(screen.getByLabelText('Имя'), 'Иван')
    await user.type(screen.getByLabelText('Фамилия'), 'Петров')
    await user.type(screen.getByLabelText('Email'), `ivan${Date.now()}@test.com`)
    await user.type(screen.getByLabelText('Пароль'), 'password123')
    await user.type(screen.getByLabelText('Повторите пароль'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'), opts)
    expect(await screen.findByText('Иван')).toBeTruthy()
    await go('/orders')
    await screen.findByText('Заказов пока нет', {}, opts)
  })

  it('unknown route shows 404', async () => {
    await go('/no/such/page')
    await screen.findByText(/404/, {}, opts)
  })
})
