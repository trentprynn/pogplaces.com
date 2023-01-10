import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="description"
                    content="Pog Places is the easiest way to find great restaurants, bars, and experiences near you! Find ground breaking new places just around the corner using Pog Places!"
                />
                <meta property="og:title" content="Pog Places" />
                <meta property="og:image" content="https://pogplaces.com/default.png" />
                <meta
                    property="og:description"
                    content="Pog Places is the easiest way to find great restaurants, bars, and experiences near you! Find ground breaking new places just around the corner using Pog Places!"
                />
                <link rel="apple-touch-icon" href="https://pogplaces.com/logo192.png" />
                <link rel="manifest" href="https://pogplaces.com/manifest.json" />

                {process.env.NODE_ENV === 'production' && (
                    <React.Fragment>
                        <script async defer data-collect-dnt="true" src="https://sa.pogplaces.com/latest.js"></script>
                        <noscript>
                            <img // eslint-disable-line
                                src="https://sa.pogplaces.com/noscript.gif?collect-dnt=true"
                                alt=""
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </noscript>
                    </React.Fragment>
                )}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
