import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { AppContextProvider } from '@/lib/context';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        <Head>
          <title>Connect Us</title>
          <meta name="description" content="Connect with educational resources tailored to your role and needs" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AppContextProvider>
    </SessionProvider>
  );
}
