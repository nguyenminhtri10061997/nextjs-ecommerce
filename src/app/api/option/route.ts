import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { getOrderBy } from "@/common/server"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { AppStatusCode } from "@/common/server/statusCode"
import prisma from "@/lib/prisma"
import { ESearchType } from "@/lib/zod/paginationDTO"
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client"
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator"

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.OPTION, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {}
        const where: Prisma.OptionWhereInput = {}

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.OptionWhereInput
          where[key] = {
            [searchQuery.searchType || ESearchType.contains]:
              searchQuery.searchStr,
          } as never
        }

        const data = await prisma.option.findMany({
          where,
          orderBy: getOrderBy(orderQuery),
          include: { optionItems: true },
        })

        return AppResponse.json({ status: 200, data })
      }
    )
  )
)

export const POST = withValidateFieldHandler(
  null,
  null,
  PostCreateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.OPTION,
        action: EPermissionAction.CREATE,
      },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const { bodyParse } = ctx
        const { name, slug, optionItems } = bodyParse!

        const exists = await prisma.option.findFirst({
          where: {
            OR: [
              {
                name,
              },
              {
                slug,
              },
            ],
          },
        })
        if (exists) {
          if (exists.name === name) {
            return AppError.json({
              status: AppStatusCode.EXISTING,
              message: "Name already exist",
            })
          }
          if (exists.slug === slug) {
            return AppError.json({
              status: AppStatusCode.EXISTING,
              message: "Slug already exist",
            })
          }
        }

        const objCreate: Prisma.OptionCreateInput = {
          name,
          slug,
          context: "PRODUCT",
          displayOrder: bodyParse?.displayOrder,
          isActive: bodyParse?.isActive,
        }

        if (optionItems?.length) {
          objCreate.optionItems = {
            createMany: {
              data: optionItems.map((atv) => ({
                name: atv.name,
                slug: atv.slug,
                displayOrder: atv.displayOrder,
              })),
            },
          }
        }

        const created = await prisma.option.create({
          data: objCreate,
        })

        return AppResponse.json({ status: 200, data: created })
      }
    )
  )
)

export const DELETE = withValidateFieldHandler(
  null,
  null,
  DeleteBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.OPTION,
        action: EPermissionAction.DELETE,
      },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.option.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        })
        return AppResponse.json({ status: 200, data: res.count })
      }
    )
  )
)
