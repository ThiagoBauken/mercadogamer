import { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@admin/store';
import SocketContextProvider from '@admin/hooks/use-socket';
import ThemeProvider from '@admin/layout/theme-provider';

import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@admin/styles/index.scss';
import Head from 'next/head';

export const MercadoGamer: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <React.Fragment>
      <Head>
        <title>MercadoGamer Administator</title>
      </Head>
      <Provider store={store}>
        <ThemeProvider>
          <SocketContextProvider>
            <ToastContainer></ToastContainer>
            <Component {...pageProps} />
          </SocketContextProvider>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
};

export default MercadoGamer;
