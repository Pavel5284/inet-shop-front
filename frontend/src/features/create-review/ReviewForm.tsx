import { Alert, Box, Button, MenuItem, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useCreateReview } from '@/entities/review'
import { getErrorMessage } from '@/shared/lib'

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
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2.5 }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Ваш отзыв" id="review"
          placeholder="Расскажите, что вам понравилось…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          minRows={3}
          fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField select label="Оценка" id="rating" value={String(rating)} onChange={(e) => setRating(Number(e.target.value))} fullWidth>
          {[1, 2, 3, 4, 5].map((value) => (
            <MenuItem key={value} value={String(value)}>
              {value} из 5
            </MenuItem>
          ))}
        </TextField>
        {error && <Alert severity="error">{error}</Alert>}
        {sent && <Alert severity="success">Спасибо! Ваш отзыв опубликован.</Alert>}
        <Button type="submit" variant="contained" loading={loading} sx={{ justifySelf: 'start' }}>
          Отправить отзыв
        </Button>
      </Box>
    </Paper>
  )
}
