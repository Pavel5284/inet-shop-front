import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useCreateReview } from '@/entities/review'
import { getErrorMessage } from '@/shared/lib'
import { Alert, Button, Select, Textarea } from '@/shared/ui'

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} из 5` }))

/** Форма публикации отзыва (только для вошедших пользователей). */
export function ReviewForm({ productId }: { productId: string }) {
  const createReview = useCreateReview()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    setLoading(true)
    void createReview({ productId, rating, text: text.trim() })
      .then(() => {
        setText('')
        setSent(true)
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
      <Textarea
        label="Ваш отзыв"
        placeholder="Расскажите, что вам понравилось…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Select label="Оценка" options={RATING_OPTIONS} value={String(rating)} onChange={(e) => setRating(Number(e.target.value))} />
      {error && <Alert>{error}</Alert>}
      {sent && <Alert tone="success">Спасибо! Ваш отзыв опубликован.</Alert>}
      <Button type="submit" loading={loading}>
        Отправить отзыв
      </Button>
    </form>
  )
}
