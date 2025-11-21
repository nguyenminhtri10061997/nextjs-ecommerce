import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { getOrderBy, getSkipAndTake } from "@/common/server"
import { AppResponse } from "@/common/server/appResponse"
import prisma from "@/lib/prisma"
import { ESearchType } from "@/lib/zod/paginationDTO"
import { TGetProductListResponse } from "@/types/api/product"
import { Prisma } from "@prisma/client"
import { GetQueryDTO } from "./validator"

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
    const { orderQuery, searchQuery, pagination } = ctx.queryParse || {}
    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
    }

    if (searchQuery?.searchKey && searchQuery?.searchStr) {
      const key = searchQuery.searchKey as keyof Prisma.ProductWhereInput
      where[key] = {
        [searchQuery.searchType || ESearchType.equals]: searchQuery.searchStr,
      } as never
    }

    const { skip, take } = getSkipAndTake({
      currentPage: pagination?.currentPage || 0,
      pageSize: pagination?.pageSize || 100,
    })

    const findManyArgs: Prisma.ProductFindManyArgs = {
      where,
      skip,
      take,
      orderBy: getOrderBy(orderQuery),
    }

    console.log(findManyArgs)

    const [data, count] = await Promise.all([
      prisma.product.findMany(findManyArgs),
      pagination ? prisma.product.count({ where }) : undefined,
    ])

    return AppResponse.json({
      status: 200,
      data: {
        data,
        pagination: pagination
          ? {
              ...pagination,
              count,
            }
          : undefined,
      } as TGetProductListResponse,
    })
  }
)
