import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { paths } from '@/shared/config'
import { getErrorMessage, getRedirectTarget, usePageTitle, type AuthRedirectState } from '@/shared/lib'
import { useRegister } from '../api/auth.api'

/** Регистрация нового покупателя. После успеха — сразу на главную (или на страницу, с которой пришли). */
export function RegisterForm() {
  usePageTitle('Регистрация')
  const navigate = useNavigate()
  const location = useLocation()
  const register = useRegister()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const state = location.state as AuthRedirectState | null

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setError(undefined)
    setLoading(true)
    void register({ firstName, lastName, email, password })
      .then(() => navigate(getRedirectTarget(state, paths.home), { replace: true }))
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }

  return (
    <Paper sx={{ maxWidth: 460, mx: 'auto', p: 3 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Регистрация
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Имя" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Фамилия" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Email" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Пароль" id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Повторите пароль" id="confirmPassword" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <Button type="submit" variant="contained" size="large" fullWidth loading={loading}>
          Зарегистрироваться
        </Button>
      </Box>
    </Paper>
  )
}
