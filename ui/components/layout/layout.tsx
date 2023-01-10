import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import axiosInstance from 'data/axios-instance'
import useUser from 'data/use-user'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import { AiFillApi } from 'react-icons/ai'
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'
import { IoLogoVenmo } from 'react-icons/io5'
import { Token } from 'types/token.type'

export default function Layout({ children, title = 'PogPlaces' }: { children: any; title?: string }) {
    const router = useRouter()

    const { user, loggedOut, mutate } = useUser()

    // if logged in, redirect to the dashboard
    useEffect(() => {}, [user, loggedOut, router])

    return (
        <React.Fragment>
            <Head>
                <title>{title}</title>
            </Head>

            <Container fluid style={{ minHeight: '100vh' }}>
                <Container style={{ height: '50px' }} className="pt-1">
                    {loggedOut && (
                        <React.Fragment>
                            {router.pathname !== '/' && (
                                <Link href="/" passHref>
                                    <Button className="me-2">Root</Button>
                                </Link>
                            )}

                            {router.pathname !== '/login' && (
                                <Link href="/login" passHref>
                                    <Button className="me-2">Log In</Button>
                                </Link>
                            )}
                        </React.Fragment>
                    )}

                    {!loggedOut && (
                        <React.Fragment>
                            {router.pathname !== '/dashboard' && (
                                <Link href="/dashboard" passHref>
                                    <Button className="me-2">Dashboard</Button>
                                </Link>
                            )}

                            {router.pathname !== '/profile' && (
                                <Link href="/profile" passHref>
                                    <Button className="me-2">Profile</Button>
                                </Link>
                            )}

                            <Button
                                type="button"
                                onClick={() => {
                                    const token = localStorage.getItem('token-pog-places')

                                    if (token) {
                                        const parsedToken: Token = JSON.parse(token)

                                        axiosInstance
                                            .delete(`/auth/refresh-token`, {
                                                data: {
                                                    refresh_token: parsedToken.refresh_token,
                                                },
                                                skipAuthRefresh: true,
                                            } as AxiosAuthRefreshRequestConfig)
                                            .catch(() => {})
                                            .finally(() => {
                                                localStorage.removeItem('token-pog-places')
                                                mutate()
                                            })
                                    }
                                }}
                            >
                                Log Out
                            </Button>
                        </React.Fragment>
                    )}
                </Container>

                <div style={{ minHeight: 'calc( 100vh - 100px)' }}>{children}</div>

                <footer className="text-center pt-3" style={{ height: '50px' }}>
                    <a href="https://github.com/trentprynn/pogplaces.com" className="me-2">
                        <FaGithub />
                    </a>
                    <a href="https://twitter.com/TrentPrynn" className="me-2">
                        <FaTwitter />
                    </a>
                    <a href="https://www.instagram.com/habitapper/" className="me-2">
                        <FaInstagram />
                    </a>
                    <a href="https://account.venmo.com/u/TrentPrynn" className="me-2">
                        <IoLogoVenmo />
                    </a>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/api-docs`}>
                        <AiFillApi />
                    </a>
                </footer>
            </Container>
        </React.Fragment>
    )
}
