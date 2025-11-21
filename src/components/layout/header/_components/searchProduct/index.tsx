"use client"

import { getS3ImgFullUrl } from "@/common"
import { CircularProgress } from "@mui/material"
import SearchIcon from "@public/svg/search.svg"
import Image from "next/image"
import Link from "next/link"
import useIndex from "./useIndex"

export default function SearchProduct() {
  const { handleSearch, query } = useIndex()

  return (
    <div className="grow flex items-center">
      <div className="hidden md:flex w-full bg-[#F0F0F0] py-[13px] px-[17.86px] rounded-[62px] relative">
        <div className="flex w-full">
          <Link href={"/search"} className="text-black/40">
            <SearchIcon width="20.27" height="20.27" />
          </Link>
          <input
            placeholder="Search for products..."
            className="outline-0 ml-3 w-full"
            onChange={handleSearch}
          />
        </div>
        <div
          id="my-search-product-result"
          className="hidden absolute left-0 bg-white border border-black/10 w-full top-14 rounded z-10 overflow-y-auto max-h-[80vh]"
        >
          {query.data?.data.map((p) => (
            <li
              key={p.id}
              className="mt-1 p-1 transition hover:bg-black/20 group rounded"
            >
              <Link href={"#"} className="flex gap-2 w-full">
                <Image
                  alt="product-image"
                  src={getS3ImgFullUrl(p.mainImage)!}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div className="flex flex-col justify-between py-2">
                  <span className="no-underline transition group-hover:font-bold group-hover:opacity-75">
                    {p.name}
                  </span>
                  <span className="text-black/40">{p.description}</span>
                </div>
              </Link>
            </li>
          ))}
          {query.isFetching && <CircularProgress />}
          {query.isFetched && query.data?.data.length === 0 && (
            <div className="p-5">NOT FOUND</div>
          )}
        </div>
      </div>
    </div>
  )
}
