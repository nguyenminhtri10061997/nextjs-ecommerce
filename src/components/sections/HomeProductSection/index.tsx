import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { cacheLife } from "next/cache"
import ProductCard from "../../customComponents/ProductCard"
import ViewAllBtn from "../../customComponents/ViewAllBtn"

export enum EType {
  NEW = "NEW",
  TOP_SELLING = "TOP_SELLING",
}

type TProps = {
  type: EType
}

export default async function HomeProductSection({ type }: TProps) {
  "use cache"
  cacheLife("seconds")

  let title
  let objFind: Prisma.ProductFindManyArgs
  switch (type) {
    case EType.TOP_SELLING:
      title = "Top Selling"
      objFind = {
        take: 4,
        orderBy: {
          soldCount: "desc",
        },
      }
      break
    default:
      title = "New arrivals"
      objFind = {
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
      }
      break
  }

  const products: Prisma.ProductGetPayload<{
    include: {
      productSkus: true
    }
  }>[] = await prisma.product.findMany({
    ...objFind,
    include: {
      productSkus: true,
    },
  })

  return (
    <div>
      <h2 className="text-[48px] italic text-center">{title}</h2>
      <div className="mt-[3.5rem] grid grid-cols-4 gap-[1.25rem]">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-[2.375rem] flex justify-center">
        <ViewAllBtn />
      </div>
    </div>
  )
}
