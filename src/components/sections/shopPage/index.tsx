import { TAppLangProps } from "@/common/server"
import AppBreadcrumbs from "@/components/customComponents/AppBreadcrumbs"
import { Divider } from "@mui/material"
import { Prisma } from "@prisma/client"
import { Suspense } from "react"
import Filter from "./components/filter"

type TProps = Pick<TAppLangProps, "lang"> & {
  queryCond: Prisma.ProductFindManyArgs
}

export default async function ShopPage({ queryCond, lang }: TProps) {
  console.log(queryCond)
  // const products = await prisma.product.findMany(queryCond)
  return (
    <div>
      <AppBreadcrumbs
        segments={[{ href: "shop", title: "Shop" }]}
        lang={lang}
      />
      <div className="grid grid-cols-[295px_1fr] gap-5 mt-[1.6875rem]">
        <Filter />
        <Suspense>
          <div>
            <div>Casual</div>
            <div className="mt-[1.5625rem] min-h-40">List</div>
            <Divider className="mt-[2.125rem]" />
            <div className="mt-5">pagination</div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}
