import axiosInstance from 'data/axios-instance'
import useUser from 'data/use-user'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
    email: string
    password: string
}

type TokenReturn = {
    access_token: string
    refresh_token: string
}

export default function Login() {
    const router = useRouter()
    const { user, loggedOut, mutate } = useUser()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    // if logged in, redirect to the dashboard
    useEffect(() => {
        if (!loggedOut) {
            router.replace('/dashboard')
        }
    }, [user, router, loggedOut])

    const [loginError, setLoginError] = useState<string | null>(null)
    const [loginIsLoading, setLoginIsLoading] = useState(false)

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log('SUBMITTING LOGIN FORM')
        console.log(data)

        setLoginIsLoading(true)
        setLoginError(null)
        axiosInstance
            .post<TokenReturn>(`/auth/login`, {
                email: data.email,
                password: data.password,
            })
            .then(function (response) {
                console.log('LOGIN SUCCESS, GOT AUTH TOKEN')
                console.log(response.data.access_token)

                const tokenToSave = JSON.stringify(response.data)
                localStorage.setItem('token-pog-places', tokenToSave)

                mutate()
            })
            .catch(function (error) {
                setLoginError(error.response.data.message)
            })
            .finally(function () {
                setLoginIsLoading(false)
            })
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1>Login</h1>

                    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                        <Form.Group className="mb-3" controlId="logInEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                {...register('email', { required: true })}
                            />
                            {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="logInPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                {...register('password', { required: true })}
                            />
                            {errors.password && <Form.Text className="text-danger">Password is required</Form.Text>}
                        </Form.Group>

                        {loginError && <p className="text-danger">{loginError}</p>}

                        <Button variant="primary" type="submit" disabled={loginIsLoading}>
                            Log in
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
