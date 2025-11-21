import { ESearchType } from "@/lib/zod/paginationDTO"
import { useState } from "react"

type TProps<T> = {
  defaultSearchKey: T
  searchType?: ESearchType
}

export default function useSearch<T = unknown>(props: TProps<T>) {
  const { searchType = ESearchType.equals } = props

  const [searchStr, setSearchStr] = useState("")
  const [searchKey, setSearchKey] = useState<T>(props.defaultSearchKey)

  return {
    searchStr,
    searchKey,
    searchType,
    setSearchStr,
    setSearchKey,
  }
}
