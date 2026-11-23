import { Search } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
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
    <Box component="form" role="search" onSubmit={onSubmit} sx={{ width: 1 }}>
      <TextField
        size="small"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск товаров"
        slotProps={{
          htmlInput: { 'aria-label': 'Поиск товаров' },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" aria-label="Найти" size="small">
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
