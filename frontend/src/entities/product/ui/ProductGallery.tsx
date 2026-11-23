import { Close, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, ButtonBase, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useRef, useState, type PointerEvent } from 'react'
import { IMAGE_FALLBACK } from '@/shared/lib'

interface ProductGalleryProps {
  images: string[]
  alt: string
  /** На странице товара по клику открывается полноэкранный просмотр. */
  zoomable?: boolean
}

/** Галерея изображений товара: крупное фото, миниатюры, стрелки, свайп и полноэкранный просмотр. */
export function ProductGallery({ images, alt, zoomable = false }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const swipeStartX = useRef<number | null>(null)

  const safeImages = images.length ? images : [IMAGE_FALLBACK]
  // Если открыли другой товар, старый выбор просто не подходит — берём первое фото.
  const currentImage = safeImages.includes(selectedImage ?? '') ? (selectedImage as string) : safeImages[0]
  const currentIndex = Math.max(0, safeImages.indexOf(currentImage))

  const step = (delta: number) => {
    if (safeImages.length < 2) return
    setSelectedImage(safeImages[(currentIndex + delta + safeImages.length) % safeImages.length])
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = event.clientX
    // Чтобы pointerup пришёл сюда даже если курсор ушёл за пределы картинки.
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartX.current
    swipeStartX.current = null
    if (start === null) return
    const delta = event.clientX - start
    if (Math.abs(delta) > 40) step(delta < 0 ? 1 : -1)
  }

  const gallery = (
    <Box>
      <Box
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeStartX.current = null
        }}
        onDragStart={(event) => event.preventDefault()}
        sx={{ position: 'relative', touchAction: 'pan-y', cursor: zoomable ? 'zoom-in' : (safeImages.length > 1 ? 'grab' : 'default'), '&:active': { cursor: zoomable ? 'zoom-in' : 'grabbing' } }}
      >
        <ButtonBase
          aria-label={zoomable ? 'Открыть изображение полностью' : undefined}
          onClick={zoomable ? () => setOpen(true) : undefined}
          sx={{ display: 'block', width: 1, cursor: 'inherit' }}
        >
          <Box
            component="img"
            draggable={false}
            src={currentImage}
            alt={alt}
            onError={(event) => {
              event.currentTarget.src = IMAGE_FALLBACK
            }}
            sx={{ width: 1, aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 2, display: 'block', userSelect: 'none' }}
          />
        </ButtonBase>
        {safeImages.length > 1 && (
          <>
            <IconButton
              aria-label="Предыдущее изображение"
              onClick={() => step(-1)}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              aria-label="Следующее изображение"
              onClick={() => step(1)}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto' }}>
        {safeImages.map((image, index) => (
          <ButtonBase
            key={`${image}-${index}`}
            aria-label={`Показать изображение ${index + 1}`}
            aria-pressed={image === currentImage}
            onClick={() => setSelectedImage(image)}
            sx={{ p: 0, border: 2, borderColor: image === currentImage ? 'primary.main' : 'transparent', borderRadius: 1, flexShrink: 0 }}
          >
            <Box
              component="img"
              draggable={false}
              src={image}
              alt=""
              onError={(event) => {
                event.currentTarget.src = IMAGE_FALLBACK
              }}
              sx={{ width: 60, height: 60, borderRadius: 0.5, objectFit: 'cover', display: 'block' }}
            />
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )

  if (!zoomable) return gallery

  return (
    <>
      {gallery}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <span>{alt}</span>
          <IconButton aria-label="Закрыть" onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProductGallery images={safeImages} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  )
}
