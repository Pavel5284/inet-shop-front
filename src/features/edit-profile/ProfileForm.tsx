import { Alert, Box, Button, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { sessionActions } from '@/entities/session'
import { useUpdateProfile, type Me } from '@/entities/user'
import { getErrorMessage } from '@/shared/lib'

/** Редактирование профиля: сервер — источник истины, локальная копия сессии обновляется после успеха. */
export function ProfileForm({ me }: { me: Me }) {
  const updateProfile = useUpdateProfile()
  const [firstName, setFirstName] = useState(me.firstName)
  const [lastName, setLastName] = useState(me.lastName)
  const [phone, setPhone] = useState(me.phone ?? '')
  const [address, setAddress] = useState(me.address ?? '')
  const [error, setError] = useState<string>()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    setSaved(false)
    setLoading(true)
    void updateProfile({ firstName, lastName, phone, address })
      .then(({ data }) => {
        if (data) {
          sessionActions.updateUser({
            id: data.updateProfile.id,
            email: data.updateProfile.email,
            firstName: data.updateProfile.firstName,
            lastName: data.updateProfile.lastName,
          })
        }
        setSaved(true)
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Имя" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Фамилия" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Телефон" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" fullWidth />
        <TextField label="Адрес доставки" id="address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
        {error && <Alert severity="error">{error}</Alert>}
        {saved && <Alert severity="success">Профиль сохранён</Alert>}
        <Button type="submit" variant="contained" loading={loading} sx={{ justifySelf: 'start' }}>
          Сохранить
        </Button>
      </Box>
    </Paper>
  )
}
