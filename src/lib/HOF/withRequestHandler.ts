import { AxiosError, AxiosResponse } from "axios";


export const withRequestHandler = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const resCall = await promise
        return {
            isSuccess: true,
            data: resCall.data,
        }
    } catch (error) {
        console.error('[Request Error]', error)
        if (error instanceof AxiosError) {
            return {
                isSuccess: false,
                error,
            }
        }
        return {
            isSuccess: false,

        }
    }
}