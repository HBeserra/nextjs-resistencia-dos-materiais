import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#206ce0',
    },
    secondary: {
      main: '#546e7a',
    },
    background: {
      default: '#F0F0F5',
      paper: '#F0F0F5',
    },
    neutral: {
      main: '#DCDCE5',
    },
    highlight: {
      main: '#fff',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    h1: {
      fontWeight: 500,
      fontSize: '2.6rem',
    },
  },
});

export default theme;
