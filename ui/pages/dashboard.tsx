import axiosInstance from 'data/axios-instance'
import useUser from 'data/use-user'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
    search: string
}

export default function Dashboard() {
    const router = useRouter()
    const { user, loggedOut } = useUser()

    // if logged in, redirect to the dashboard
    useEffect(() => {
        if (loggedOut) {
            router.replace('/login')
        }
    }, [user, loggedOut, router])

    const [results, setResults] = useState<any | undefined>(undefined)
    const [filteredResults, setFilteredResults] = useState<any | undefined>(undefined)

    const [pageCode, setPageCode] = useState<any | undefined>(undefined)

    const [fetchError, setFetchError] = useState<string | null>(null)
    const [responseIsLoading, setResponseIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit: SubmitHandler<FormValues> = (formData) => {
        console.log('SUBMITTING FORM')
        console.log(formData)

        setResponseIsLoading(true)
        setResults(undefined)
        setPageCode(undefined)
        setFilteredResults(undefined)
        setFetchError(null)
        axiosInstance
            .get<any>(`/places/${formData.search}`)
            .then(function (response) {
                console.log('GOT PLACE DETAILS')
                console.log(response.data)

                setPageCode(response.data.next_page_token)

                setResults(response.data.results)

                let filteredResults = response.data.results.filter((r: any) => {
                    return r.rating >= 4.5
                })
                setFilteredResults(filteredResults)
            })
            .catch(function (error) {
                console.log(error)
                setFetchError(error.response.data.message)
            })
            .finally(function () {
                setResponseIsLoading(false)
            })
    }

    const fetchMore = (pageCode: string) => {
        axiosInstance
            .get<any>(`places/more-places/${pageCode}`)
            .then(function (additionalResponse) {
                console.log('FETCHED ADDITIONAL RESULTS')
                console.log(additionalResponse.data)

                setPageCode(additionalResponse.data.next_page_token)

                let combinedResults = results.concat(additionalResponse.data.results)

                console.log('COMBINED')
                console.log(`LENGTH: ${combinedResults.length}`)
                console.log(combinedResults)

                setResults(combinedResults)

                let filteredAdditionalResults = additionalResponse.data.results.filter((r: any) => {
                    return r.rating >= 4.5
                })

                let filteredCombinedResults = filteredResults.concat(filteredAdditionalResults)
                setFilteredResults(filteredCombinedResults)
            })
            .catch(function (error) {
                console.log(error)
                setFetchError(error.response.data.message)
            })
            .finally(function () {
                setResponseIsLoading(false)
            })
    }

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className="text-center">Dashboard</h1>
                    {user && <p className="text-center">{user.email}</p>}
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs="12" md="6" xl="2">
                    <h2 className="mt-5">Place Search</h2>
                    <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                        <Form.Group className="mb-3" controlId="search">
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter search"
                                {...register('search', { required: true })}
                            />
                            {errors.search && <Form.Text className="text-danger">Search value is required</Form.Text>}
                        </Form.Group>

                        {fetchError && <p className="text-danger">{fetchError}</p>}

                        <Button variant="primary" type="submit" disabled={responseIsLoading} className="mt-3">
                            Search
                        </Button>
                    </Form>
                </Col>
            </Row>

            {filteredResults && (
                <React.Fragment>
                    <Row className="justify-content-center mt-3">
                        <Col xs="12" md="6" xl="2">
                            {filteredResults.map((result: any) => (
                                <div key={result.place_id} className="mb-5">
                                    <h3>RESULT</h3>
                                    <p>name: {result.name}</p>
                                    <p>status: {result.business_status}</p>
                                    <p>price level: {result.price_level}</p>
                                    <p>rating: {result.rating}</p>
                                    <p>number of ratings: {result.user_ratings_total}</p>
                                    <hr></hr>
                                </div>
                            ))}

                            {results && <p>total results found: {results.length}</p>}
                            <p>showing: {filteredResults.length}</p>

                            {results.length === 60 && (
                                <p>
                                    <b>Google only allows 60 results for a search, sorry!</b>
                                </p>
                            )}

                            {results.length < 60 &&
                                (results.length % 20 === 0 ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            fetchMore(pageCode)
                                        }}
                                    >
                                        Load More
                                    </Button>
                                ) : (
                                    <p>
                                        <b>No more results found for this search!</b>
                                    </p>
                                ))}
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}
