import useUser from 'data/use-user'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

export default function Profile() {
    const router = useRouter()
    const { user, loggedOut } = useUser()

    useEffect(() => {
        if (loggedOut) {
            router.replace('/login')
        }
    }, [user, loggedOut, router])

    return (
        <Row className="justify-content-center">
            <Col xs="auto">
                <h1 className="text-center">Profile</h1>
                {user && <p>{user.email}</p>}
            </Col>
        </Row>
    )
}
