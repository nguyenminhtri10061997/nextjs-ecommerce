import { debounce } from "@/common/client"
import { gsap } from "@/lib/gsap"
import { useGetProductSearchQuery } from "@/lib/reactQuery/product"
import { ESearchType } from "@/lib/zod/paginationDTO"
import { useGSAP } from "@gsap/react"
import { ChangeEvent, useState } from "react"

export default function useIndex() {
  const [search, setSearch] = useState("")

  const query = useGetProductSearchQuery(!!search, {
    orderQuery: {
      orderKey: "createdAt",
      orderType: "desc",
    },
    searchQuery: {
      searchStr: search,
      searchKey: "name",
      searchType: ESearchType.contains,
    },
  })

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  })

  useGSAP(
    () => {
      const resEl = document.getElementById("my-search-product-result")
      if (!resEl) return

      const items = resEl.querySelectorAll("li")

      if (search) {
        // Show container
        gsap.set(resEl, { display: "block" })

        // Fade + slide container
        gsap.fromTo(
          resEl,
          {
            opacity: 0,
            y: -10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
          }
        )

        if (query.isFetched) {
          // Animate items
          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: 10,
            },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.2,
            }
          )
        }
      } else {
        gsap.to(resEl, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            gsap.set(resEl, {
              clearProps: "opacity,y",
              display: "none",
            })
          },
        })
      }
    },
    {
      dependencies: [search, query.isFetched],
    }
  )

  return {
    handleSearch,
    query,
  }
}
