import { getS3ImgFullUrl } from "@/common"
import { Prisma } from "@prisma/client"
import Image from "next/image"
import { StarRating } from "../ProductRating"
import Link from "next/link"

type TProps = {
  product: Prisma.ProductGetPayload<{
    include: {
      productSkus: true
    }
  }>
}

export default function ProductCard({ product }: TProps) {
  const { avgRateByAdmin, avgRateBySystem, productSkus, type, mainImage, slug } =
    product

  const avgRate = avgRateByAdmin || avgRateBySystem

  const renderPrice = () => {
    let price, salePrice
    switch (type) {
      case "SIMPLE":
      case "DIGITAL":
      case "SERVICE":
        const [sku] = productSkus
        price = sku.price
        salePrice = sku.salePrice
      case "VARIABLE":
        let [minPs] = productSkus
        productSkus.forEach(ps => {
          const curPrice = ps.salePrice || ps.price
          const minPrice = minPs.salePrice || minPs.price
          if (minPrice > curPrice) {
            minPs = ps
          }
        })
        price = minPs.price
        salePrice = minPs.salePrice
    }

    return (
      <div>
        <span>{price}$</span>
        {salePrice && <span className="line-through">{salePrice}$</span>}
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-[18.4375rem] h-[18.625rem] rounded-[1.25rem] bg-[#F0EEED] overflow-hidden">
        <Link href={`/product/${slug}`}>
        <Image
          src={getS3ImgFullUrl(mainImage)!}
          alt="product.mainImage"
          fill
        />
        </Link>
      </div>
      <div className="mt-4">
        <div className="italic text-[1.25rem]">{product.name}</div>
        {!!avgRate && (
          <div className="mt-[0.625rem] flex items-center">
            <div className="flex">
              <StarRating rate={avgRate!} />
            </div>
            <span className="ml-1 text-sm leading-2.5">
              {avgRate}/<span className="text-black/60">5</span>
            </span>
          </div>
        )}
        <h3 className="mt-[0.5787rem] text-2xl italic">{renderPrice()}</h3>
      </div>
    </div>
  )
}
