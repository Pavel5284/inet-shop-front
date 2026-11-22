import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DEMO_CREDENTIALS, SHOW_DEMO_LOGIN, paths } from '@/shared/config'
import { getErrorMessage, getRedirectTarget, usePageTitle, type AuthRedirectState } from '@/shared/lib'
import { useLogin } from '../api/auth.api'

/** Форма входа: обычный вход по email и кнопка демо-входа. После входа возвращает на исходную страницу. */
export function LoginForm() {
  usePageTitle('Вход')
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const state = location.state as AuthRedirectState | null
  const target = getRedirectTarget(state, paths.home)

  const submit = async (loginEmail: string, loginPassword: string) => {
    setError(undefined)
    setLoading(true)
    try {
      await login({ email: loginEmail, password: loginPassword })
      navigate(target, { replace: true })
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit(email, password)
  }

  return (
    <Paper sx={{ maxWidth: 460, mx: 'auto', p: 3 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Вход
      </Typography>
      {state?.reason && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {state.reason}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Пароль" id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <Button type="submit" variant="contained" size="large" fullWidth loading={loading}>
          Войти
        </Button>
      </Box>
      {SHOW_DEMO_LOGIN && (
        <Button variant="outlined" fullWidth loading={loading} sx={{ mt: 2 }} onClick={() => void submit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)}>
          Войти как демо-пользователь
        </Button>
      )}
    </Paper>
  )
}
