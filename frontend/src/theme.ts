import { createTheme } from '@mui/material/styles'

export const colors = {
  black: '#080705',
  charcoalBlue: '#40434E',
  winePlum: '#702632',
  burntRose: '#912F40',
  porcelain: '#FFFFFA',
}

// Brand display face for headings (@font-face in index.css)
export const displayFont = '"Redaction", Georgia, "Times New Roman", serif'

const theme = createTheme({
  palette: {
    primary: {
      main: colors.burntRose,
      dark: colors.winePlum,
      contrastText: colors.porcelain,
    },
    secondary: {
      main: colors.charcoalBlue,
      contrastText: colors.porcelain,
    },
    text: {
      primary: colors.black,
      secondary: colors.charcoalBlue,
    },
    background: {
      default: colors.porcelain,
      paper: '#FFFFFF',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
})

export default theme
