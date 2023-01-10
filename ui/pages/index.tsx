import useUser from 'data/use-user'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export default function Root() {
    const router = useRouter()
    const { user, loggedOut } = useUser()

    // if logged in, redirect to the dashboard
    useEffect(() => {
        if (!loggedOut) {
            router.replace('/dashboard')
        }
    }, [user, router, loggedOut])

    return (
        <Row className="justify-content-center">
            <Col xs="auto">
                <h1 className="text-center">Pog Places</h1>
                <p className="text-center">find great stuff.</p>
            </Col>
        </Row>
    )
}
