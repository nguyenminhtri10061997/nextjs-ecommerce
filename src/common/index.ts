import { TOrderQuery, TPaginationParams } from "@/types/api/common"

export const getSegments = (pathname: string) => {
    return pathname
        .substring(6)
        .split('/')
        .filter(Boolean)
}

export const getSkipAndTake = (pagination?: TPaginationParams) => {
    if (pagination) {
        return {
            skip: pagination?.currentPage *
                pagination?.pageSize,
            take: pagination?.pageSize
        }
    }
    return {}
}


export const getOrderBy = (orderQuery?: TOrderQuery) => {
    if (orderQuery?.orderKey && orderQuery?.orderType) {
        return {
            [orderQuery.orderKey]:
                orderQuery.orderType,
        };
    }
    return {}
}