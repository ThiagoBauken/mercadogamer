import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import "antd/dist/antd.css";
import { store } from '@store';
import SocketContextProvider from '@web/hooks/use-socket';
import ThemeProvider from '@layout/storybook-theme-provider';

import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-multi-carousel/lib/styles.css';
import '../styles/index.scss';
import Script from 'next/script';
import { useRouter } from 'next/router';

export const MercadoGamer: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const getRelTag = () => {
    const path = router.asPath;

    const urls = [
      'regalos',
      'catalogo'
    ];

    if(path === '' || path === '/' || urls.some((str) => path.includes(str))) {
      return (
        <link rel="canonical" href={`https://www.mercadogamer.com${router.asPath}`} />
      )
    }

    return (
      <link
        rel="alternate"
        href={`https://www.mercadogamer.com${router.asPath}`}
        hrefLang="es-arg"
      />
    )
  }

  return (
    <React.Fragment>
      {/*  GTM script */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5P688DN');
        `,
        }}
      ></Script>
      {/* Facebook pixel */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '441509394228538'); 
            fbq('track', 'PageView');
            `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          src="https://www.facebook.com/tr?id=441509394228538&ev=PageView&noscript=1"
        />
      </noscript>

      {/* Google analysis */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=UA-244867745-1`}
      />
      <Script strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-244867745-1');
      `}
      </Script>
      <Script
        type="FAQPage"
        dangerouslySetInnerHTML={{
          __html: `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": {
            "@type": "Question",
            "text": "¿Qué puedo vender en Mercado Gamer?",
            "dateCreated": "2022-11-08",
            "author": {
              "@type": "Person",
              "name": "Santiago Maggio - Cristal"
            },
             "acceptedAnswer": {
              "@type": "Answer",
              "text": "En Mercado Gamer puedes publicar cualquier tipo de producto digital canjeable o transferible, está pensado para que puedan publicar sus ítems digitales y obtener beneficios económicos por ellos, sean skins, packs, gift cards, monedas y más. ¡Lo que no te sirve a vos, siempre le viene bien a otro!",
              "dateCreated": "2022-11-08",
             "url": "https://www.mercadogamer.com/help-center/frequent/108",
              "author": {
                "@type": "Person",
                "name": "Santiago Maggio - Cristal"
              }      
             }
          }
        }`,
        }}
      ></Script>
      <Head>
        <title>
          {router.asPath === '/' || router.route === '/regalos' ? pageProps.title : 'Mercado Gamer'}
        </title>
        <meta
          name="viewport"
          content="target-densityDpi=device-dpi, width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
        <meta name="description" content={pageProps.description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          key="og:url"
          content={`https://www.mercadogamer.com${router.asPath}`}
        />

        {router.route === '/regalos' || router.route === '/rb/[id]' ? (
          <meta
            name="og:image"
            property="og:image"
            content="/assets/imgs/og-meta-tag/Regalos.png"
          />
        ) : (
          <meta
            name="og:image"
            property="og:image"
            content="/assets/imgs/og-meta-tag/MG-Logo.png"
          />
        )}

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
