import Layout from 'components/layout/layout'
import axiosInstance from 'data/axios-instance'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { SWRConfig } from 'swr'
import './../style/app.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher: axiosInstance,
            }}
        >
            <SSRProvider>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SSRProvider>
        </SWRConfig>
    )
}
