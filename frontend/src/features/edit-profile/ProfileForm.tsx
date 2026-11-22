import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { sessionActions } from '@/entities/session'
import { useUpdateProfile, type Me } from '@/entities/user'
import { getErrorMessage } from '@/shared/lib'
import { Alert, Button, Input } from '@/shared/ui'

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
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <Input label="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      <Input label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" />
      <Input label="Адрес доставки" value={address} onChange={(e) => setAddress(e.target.value)} />
      {error && <Alert>{error}</Alert>}
      {saved && <Alert tone="success">Профиль сохранён</Alert>}
      <Button type="submit" loading={loading}>
        Сохранить
      </Button>
    </form>
  )
}
