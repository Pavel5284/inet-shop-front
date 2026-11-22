import { Search } from 'lucide-react'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '@/shared/config'

/** Строка поиска: переводит запрос в параметр ?q= страницы каталога. */
export function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `${paths.catalog}?q=${encodeURIComponent(q)}` : paths.catalog)
  }

  return (
    <form role="search" onSubmit={onSubmit} className="flex h-10 w-full items-center rounded-xl bg-slate-100 px-3 focus-within:ring-2 focus-within:ring-brand-light">
      <input
        type="search"
        aria-label="Поиск товаров"
        placeholder="Поиск товаров"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
      <button type="submit" aria-label="Найти" className="ml-2 text-slate-500 hover:text-brand">
        <Search className="size-5" />
      </button>
    </form>
  )
}
