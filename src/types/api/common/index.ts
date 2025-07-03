import { ESearchType } from "@/lib/zod/paginationDTO"

export type TPaginationParams = {
    currentPage: number
    pageSize: number
}

export type TPaginationResponse = {
    currentPage: number
    pageSize: number
    count: number
}

export type SortOrder = 'asc' | 'desc'

export type TOrderQuery<TKey = string> = {
    orderKey?: TKey
    orderType?: SortOrder
}

type TQuerySearch<T = unknown> = {
  searchStr: string
  searchKey: T
  searchType: ESearchType
}

export type TSearchQuery<T = unknown> = {
  searchQuery: TQuerySearch<T>
}


export type TQueryPaginationAndOrder = {
    pagination: TPaginationParams
    orderQuery: TOrderQuery
}

export type TAppResponseInput = {
  status?: number
  message?: string
  data?: unknown
}


export type TAppResponseBody<T = unknown> = {
  isSuccess: boolean
  message: string
  data: T
}