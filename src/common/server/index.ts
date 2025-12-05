import {
  TDictionaryKeys,
  TReturnOfGetDictionary,
} from "@/app/[lang]/dictionaries"
import { TOrderQuery, TPaginationParams } from "@/types/api/common"

export const getSkipAndTake = (pagination?: TPaginationParams) => {
  if (pagination) {
    return {
      skip: pagination?.currentPage * pagination?.pageSize,
      take: pagination?.pageSize,
    }
  }
  return {}
}

export const getOrderBy = (orderQuery?: TOrderQuery) => {
  if (orderQuery?.orderKey && orderQuery?.orderType) {
    return {
      [orderQuery.orderKey]: orderQuery.orderType,
    }
  }
  return {}
}

export type TAppLangProps = {
  dict: TReturnOfGetDictionary
  lang: TDictionaryKeys
}

export const getAppLinkWithLang = (lang: TDictionaryKeys, href: string) => {
  return `/${lang}${href}`
}
