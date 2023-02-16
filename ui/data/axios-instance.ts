import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { Token } from 'types/token.type'

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
})

// add JWT auth header append interceptor
axiosInstance.interceptors.request.use(function (request) {
    const token = localStorage.getItem('token-pog-places')

    if (token) {
        const parsedToken: Token = JSON.parse(token)

        request.headers.Authorization = `Bearer ${parsedToken.access_token}`
    }

    return request
})

// add JWT auth token refresh interceptor
const refreshAuthLogic = (failedRequest: any) => {
    const token = localStorage.getItem('token-pog-places')

    if (token) {
        console.log('REFRESHING AUTH TOKEN')

        const parsedToken: Token = JSON.parse(token)

        return axiosInstance
            .post<Token>('auth/refresh-token', {
                refresh_token: parsedToken.refresh_token,
            })
            .then((tokenRefreshResponse) => {
                const tokenToSave = JSON.stringify(tokenRefreshResponse.data)
                localStorage.setItem('token-pog-places', tokenToSave)

                failedRequest.response.config.headers['Authorization'] =
                    'Bearer ' + tokenRefreshResponse.data.access_token
                return Promise.resolve()
            })
            .catch((err) => {
                console.log('REFRESH TOKEN FAILED')
                localStorage.removeItem('token-pog-places')
                return Promise.reject()
            })
    } else {
        console.log('SKIPPING AUTH TOKEN REFRESH -- NO TOKEN')
        return Promise.resolve()
    }
}
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    shouldRefresh: (error) => {
        // an HTTP401 response can mean either there was no auth token sent or the auth
        // token sent was invalid (expired). Before refreshing the token we need to check
        // the API response error message to make sure the reason we're going to refresh is
        // because the token expired.
        if (error?.response?.status === 401) {
            const data = error?.response?.data as any
            if (data.message === 'Token invalid') {
                return true
            }
        }

        return false
    },
})

// export created axios instance
export default axiosInstance
