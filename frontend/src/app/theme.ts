import { createTheme } from '@mui/material/styles'

/** Единая тема Material UI: фирменные цвета и базовые настройки интерфейса. */
export const theme = createTheme({
  palette: {
    primary: { main: '#005bff', dark: '#0047cc', light: '#e8f0ff' },
    secondary: { main: '#f91155' },
    background: { default: '#f1f3f7', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { defaultProps: { elevation: 1 } },
    MuiTextField: { defaultProps: { size: 'small' } },
  },
})
