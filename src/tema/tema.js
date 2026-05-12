/**
 * tema.js — Tema customizado do Material UI para o ConectaDoa
 *
 * Define as cores, tipografia e estilos globais usados em toda a aplicação.
 * As cores foram extraídas do logotipo do ConectaDoa (tons de azul e ciano).
 */
import { createTheme } from '@mui/material/styles';

const tema = createTheme({
  palette: {
    primary: {
      // Azul escuro principal — cor dominante do logotipo
      main: '#1a3c6e',
      light: '#2e6da4',
      dark: '#0f2744',
      contrastText: '#ffffff',
    },
    secondary: {
      // Ciano/turquesa — cor de destaque do logotipo
      main: '#4fc3f7',
      light: '#8bf6ff',
      dark: '#0093c4',
      contrastText: '#000000',
    },
    background: {
      // Fundo claro com leve tom de cinza (como nos protótipos)
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  shape: {
    // Bordas arredondadas como nos protótipos
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 28,
          },
        },
      },
    },
  },
});

export default tema;
