import { useMe } from '@/entities/user'
import { ProfileForm } from '@/features/edit-profile'
import { LogoutButton } from '@/features/logout'
import { usePageTitle } from '@/shared/lib'
import { ErrorState, PageLoader } from '@/shared/ui'

export function ProfilePage() {
  usePageTitle('Профиль')
  const { data, loading, error, refetch } = useMe()
  const user = data?.me

  if (!user) {
    return loading ? (
      <PageLoader />
    ) : (
      <ErrorState message={error ? 'Не удалось загрузить профиль' : 'Профиль недоступен'} onRetry={() => void refetch()} />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">Профиль</h1>
      <ProfileForm me={user} />
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  )
}
