import '../styles/globals.css';
import Head from 'next/head';
import { ThemeProvider } from '@mui/system';
import { Box, CssBaseline } from '@mui/material';
import theme from '../components/theme';
// import ReactGA from 'react-ga4';

// ReactGA.initialize("G-X270YGFGX9");

// if(typeof window !== "undefined") ReactGA.send({ hitType: "pageview", page: window?.location?.pathname });

export default function MyApp({ Component, pageProps }) {
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
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <meta charSet="utf-8" />
        <meta name="language" content="pt-BR" />
        <title>
          My Package | Rastreador de encomendas para pequenos negócios
        </title>
        <meta
          name="description"
          content="Crie links de rastreio das suas vendas para os seus clientes gratuitamente! "
        />
        <meta name="robots" content="noimageclick" />
        <meta name="author" content="Herbert F Beserra" />
        <meta name="keywords" content="correios, rastreamento, gratuitamente" />
        <meta name="theme-color" content="#E02041" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MY Package" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#E02041" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <CssBaseline />

      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
          }}
        >
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </>
  );
}
