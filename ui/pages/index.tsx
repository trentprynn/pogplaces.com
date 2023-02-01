import useUser from 'data/use-user'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap'

export default function Root() {
    const router = useRouter()
    const { user, loggedOut } = useUser()

    // if logged in, redirect to the search page
    useEffect(() => {
        if (!loggedOut) {
            router.replace('/search')
        }
    }, [user, router, loggedOut])

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className="text-center">Pog Places</h1>
                    <p className="text-center">find great stuff.</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Link href="/login" passHref>
                        <Button>Log In</Button>
                    </Link>
                </Col>
            </Row>
        </React.Fragment>
    )
}
