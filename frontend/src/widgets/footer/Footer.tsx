import { Box, Container, Typography } from '@mui/material'
import { APP_NAME } from '@/shared/config'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 3 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          © {YEAR} {APP_NAME}. Все права защищены.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Интернет-магазин для всей семьи
        </Typography>
      </Container>
    </Box>
  )
}
