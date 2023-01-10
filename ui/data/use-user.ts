import { AxiosResponse } from 'axios'
import useSWR from 'swr'

type User = {
    userId: string
    email: string
    name: string | null
    createdAt: Date
    updatedAt: Date
}

export default function useUser() {
    const { data, mutate, error } = useSWR<AxiosResponse<User>>(`/user`)

    const loading = !!(!data && !error)
    const loggedOut = !!(error && error.response && error.response.status === 401)

    return {
        loading,
        loggedOut,
        user: data?.data,
        mutate,
    }
}
