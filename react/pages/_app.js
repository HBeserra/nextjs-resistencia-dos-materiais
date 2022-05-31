import '../styles/globals.css';
import Head from 'next/head';
import { ThemeProvider } from '@mui/system';
import { Box, CssBaseline, Fade, IconButton } from '@mui/material';
import theme from '../components/theme';
import { SnackbarProvider } from 'notistack';
import { createRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';


// import ReactGA from 'react-ga4';

// ReactGA.initialize("G-X270YGFGX9");

// if(typeof window !== "undefined") ReactGA.send({ hitType: "pageview", page: window?.location?.pathname });

export default function MyApp({ Component, pageProps }) {
  const notistackRef = createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  }
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link
          href="/icon_x42.png"
          rel="icon"
          type="image/png"
          sizes="42x42"
        />
        <link
          href="/icon_x72.png"
          rel="icon"
          type="image/png"
          sizes="72x72"
        />
        <meta charSet="utf-8" />
        <meta name="language" content="pt-BR" />
        <title>
          Calculadora de eixo | A3 Resmat
        </title>
        <meta
          name="description"
          content="Calculador de eixos, resistencia dos materiais."
        />
        <meta name="robots" content="noimageclick" />
        <meta name="author" content="Herbert F Beserra" />
        <meta name="keywords" content="resmat, eixo, gratuitamente" />
        <meta name="theme-color" content="#206ce0" />
        <meta name="theme-color" content="#206ce0" />
      </Head>
      <CssBaseline />

      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={10000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          ref={notistackRef}
          action={(key) => (
            <IconButton onClick={onClickDismiss(key)} aria-label="close">
            <CloseIcon />
          </IconButton>
          )}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              bgcolor: 'background.default',
              color: 'text.primary',
              minHeight: '100vh',
            }}
          >
            <Component {...pageProps} />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
