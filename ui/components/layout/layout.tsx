import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import axiosInstance from 'data/axios-instance'
import useUser from 'data/use-user'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Button, Col, Container, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import { AiFillApi } from 'react-icons/ai'
import { BiUserCircle } from 'react-icons/bi'
import { FaCircle, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'
import { IoLogoVenmo } from 'react-icons/io5'
import { Token } from 'types/token.type'

export default function Layout({ children, title = 'PogPlaces' }: { children: any; title?: string }) {
    const router = useRouter()

    const { user, loggedOut, mutate } = useUser()

    const profilePopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">{user && user.email}</Popover.Header>
            <Popover.Body>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Button
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
                            log out
                        </Button>
                    </Col>
                </Row>
            </Popover.Body>
        </Popover>
    )

    return (
        <React.Fragment>
            <Head>
                <title>{title}</title>
            </Head>

            <Container fluid style={{ minHeight: '100vh' }}>
                <Container
                    style={{ height: '65px', paddingTop: '10px', paddingBottom: '15px' }}
                    className="border-bottom"
                >
                    <Row className="justify-content-between">
                        <Col xs="auto">
                            <div style={{ height: '40px', width: '40px' }}>
                                <Link href={loggedOut ? '/' : '/search'} passHref>
                                    <Image
                                        className="img-fluid"
                                        loading="lazy"
                                        height={512}
                                        width={512}
                                        src="/logo192.png"
                                        alt="pog places logo"
                                    ></Image>
                                </Link>
                            </div>
                        </Col>

                        <Col xs="auto">
                            <Row>
                                {loggedOut && (
                                    <React.Fragment>
                                        <Col xs="auto">
                                            <Link href="/" passHref>
                                                <small>home</small>
                                            </Link>

                                            {router.pathname === '/' && (
                                                <Row className="justify-content-center">
                                                    <Col xs="auto">
                                                        <FaCircle className="text-primary" />
                                                    </Col>
                                                </Row>
                                            )}
                                        </Col>

                                        <Col xs="auto">
                                            <Link href="/login" passHref>
                                                <small>login</small>
                                            </Link>

                                            {router.pathname === '/login' && (
                                                <Row className="justify-content-center">
                                                    <Col xs="auto">
                                                        <FaCircle className="text-primary" />
                                                    </Col>
                                                </Row>
                                            )}
                                        </Col>
                                    </React.Fragment>
                                )}

                                {!loggedOut && (
                                    <React.Fragment>
                                        <Col xs="auto">
                                            <Link href="/search" passHref>
                                                <small>search</small>
                                            </Link>

                                            {router.pathname === '/search' && (
                                                <Row className="justify-content-center">
                                                    <Col xs="auto">
                                                        <FaCircle className="text-primary" />
                                                    </Col>
                                                </Row>
                                            )}
                                        </Col>

                                        <Col xs="auto" className="d-flex aligns-items-center">
                                            <OverlayTrigger trigger="click" placement="bottom" overlay={profilePopover}>
                                                <Button type="button">
                                                    <BiUserCircle className="fs-4" />
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                    </React.Fragment>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <div style={{ minHeight: 'calc( 100vh - 115px)' }} className="pt-5">
                    {children}
                </div>

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
