import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { getOrderBy, getSkipAndTake } from "@/common/server"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import prisma from "@/lib/prisma"
import AppS3Client from "@/lib/s3"
import { ESearchType } from "@/lib/zod/paginationDTO"
import { TGetProductListResponse } from "@/types/api/product"
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client"
import dayjs from "dayjs"
import { output } from "zod/v4"
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator"

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.PRODUCT, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery, pagination, dateRangeQuery } =
          ctx.queryParse || {}
        const where: Prisma.ProductWhereInput = {
          isDeleted: false,
        }

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.ProductWhereInput
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]:
              searchQuery.searchStr,
          } as never
        }

        if (dateRangeQuery?.startDate && dateRangeQuery?.endDate) {
          where["createdAt"] = {
            gte: dayjs(dateRangeQuery.startDate).startOf("d").toDate(),
            lte: dayjs(dateRangeQuery.endDate).startOf("d").toDate(),
          }
        }

        const { skip, take } = getSkipAndTake(pagination)

        const findManyArgs: Prisma.ProductFindManyArgs = {
          where,
          skip,
          take,
          orderBy: getOrderBy(orderQuery),
        }

        const [data, count] = await Promise.all([
          prisma.product.findMany(findManyArgs),
          skip && take ? prisma.product.count({ where }) : undefined,
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
  )
)

const functionName = "product-create"
const getMainImageFinal = async (key: string) => {
  return AppS3Client.moveFromTempToFinalS3File(key, false, functionName)
}

const getListImageFinal = async (keys: string[]) => {
  return await Promise.all(
    keys.map((key) =>
      AppS3Client.moveFromTempToFinalS3File(key, false, functionName)
    )
  )
}

const getAttributeValueImgFinal = async (
  atts: output<typeof PostCreateBodyDTO>["attributes"]
) => {
  return await Promise.all(
    atts?.map(
      async (at) =>
        await Promise.all(
          at.productAttValues.map((attv) => {
            return AppS3Client.moveFromTempToFinalS3File(attv.image, false)
          })
        )
    ) || []
  )
}

const getSkuFinal = async (skus: output<typeof PostCreateBodyDTO>["skus"]) => {
  return await Promise.all(
    skus.map((sku) =>
      AppS3Client.moveFromTempToFinalS3File(sku.image, false, functionName)
    )
  )
}

const handleCreate = async (
  body: output<typeof PostCreateBodyDTO>,
  resRollback: { urlImgToRollbacks: (string | null)[] }
) => {
  const {
    code,
    name,
    slug,
    attributes,
    skus,
    productTags,
    productOptions,
    mainImage,
    listImages,
    ...omit
  } = body

  const mainImageFinal = await getMainImageFinal(mainImage)
  resRollback.urlImgToRollbacks =
    resRollback.urlImgToRollbacks.concat(mainImageFinal)
  const listImageFinal = (await getListImageFinal(listImages)) as string[]
  resRollback.urlImgToRollbacks =
    resRollback.urlImgToRollbacks.concat(listImages)
  const attributeValuesImgFinal = await getAttributeValueImgFinal(attributes)
  resRollback.urlImgToRollbacks = resRollback.urlImgToRollbacks.concat(
    attributeValuesImgFinal.flat()
  )
  const skusImgFinal = await getSkuFinal(skus)
  resRollback.urlImgToRollbacks =
    resRollback.urlImgToRollbacks.concat(skusImgFinal)

  const objCreate: Prisma.ProductCreateInput = {
    ...omit,
    code,
    name,
    slug,
    mainImage: mainImageFinal!,
    listImages: listImageFinal,
  }

  if (attributes?.length) {
    objCreate.attributes = {
      create: attributes.map(
        (at, idxAt) =>
          ({
            id: at.id,
            displayOrder: at.displayOrder,
            status: at.status,
            attributeId: at.attributeId,
            isUsedForVariations: at.isUsedForVariations,

            attributeValues: {
              create: at.productAttValues.map(
                (atv, idxAtv) =>
                  ({
                    id: atv.id,
                    attributeValueId: atv.attributeValueId,
                    productAttributeId: at.id,
                    image: attributeValuesImgFinal[idxAt][idxAtv],
                    displayOrder: atv.displayOrder,
                    status: atv.status,
                  } as Prisma.ProductAttributeValueUncheckedCreateInput)
              ),
            },
          } as Prisma.ProductAttributeUncheckedCreateWithoutProductInput)
      ),
    }
  }

  if (skus?.length) {
    objCreate.skus = {
      create: skus.map(
        (sku, idxSku) =>
          ({
            sellerSku: sku.sellerSku,
            stockStatus: sku.stockStatus,
            stockType: sku.stockType,
            salePrice: sku.salePrice,
            price: sku.price,
            costPrice: sku.costPrice,
            stock: sku.stock,
            barcode: sku.barcode,
            weight: sku.weight,
            width: sku.width,
            height: sku.height,
            length: sku.length,
            note: sku.note,
            image: skusImgFinal[idxSku],
            status: sku.status,
            isDefault: sku.isDefault,
            displayOrder: sku.displayOrder,
            downloadUrl: sku.downloadUrl,
            skuAttributeValues: {
              create: sku.productSkuAttValues,
            },
          } as Prisma.ProductSkuCreateWithoutProductInput)
      ),
    }
  }

  if (productTags?.length) {
    objCreate.productTags = {
      create: productTags.map((pt) => ({
        expiredAt: pt.expiredAt,
        productTagId: pt.productTagId,
      })),
    }
  }

  if (productOptions?.length) {
    objCreate.productOptions = {
      create: productOptions.map(
        (op) =>
          ({
            optionId: op.optionId,
            displayOrder: op.displayOrder,
            isRequired: op.isRequired,
            maxSelect: op.maxSelect,
            productToOptionToOptionItem: {
              createMany: {
                data: op.productOptionItems?.map(
                  (opI) =>
                    ({
                      productOptionId: opI.productOptionId,
                      optionItemId: opI.optionItemId,
                      displayOrder: opI.displayOrder,
                      priceModifierType: opI.priceModifierType,
                      priceModifierValue: opI.priceModifierValue,
                    } as Prisma.ProductOptionToOptionItemUncheckedCreateInput)
                ),
              },
            },
          } as Prisma.ProductOptionUncheckedCreateWithoutProductInput)
      ),
    }
  }

  const res = await prisma.product.create({
    data: objCreate,
  })

  try {
    await AppS3Client.s3DeleteFiles(
      [mainImage]
        .concat(listImages)
        .concat(
          attributes
            ?.flatMap((i) => (i.productAttValues || []).map((j) => j.image))
            .filter((i): i is string => i != null) || []
        )
        .concat(skus.map((i) => i.image).filter((i): i is string => i != null)),
      functionName
    )
  } catch (err) {
    console.error("Failed to cleanup temp S3 files", err)
  }

  return AppResponse.json({ status: 200, data: res })
}

export const POST = withValidateFieldHandler(
  null,
  null,
  PostCreateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT,
        action: EPermissionAction.CREATE,
      },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const { code, name, slug } = ctx.bodyParse!

        const exists = await prisma.product.findFirst({
          where: {
            OR: [
              {
                code,
              },
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
          return AppError.json({
            status: 409,
            message: `${exists.name === name ? "name" : "slug"} already exists`,
          })
        }
        const resRollback = {
          urlImgToRollbacks: [],
        }
        try {
          return handleCreate(ctx.bodyParse!, resRollback)
        } catch (err) {
          if (resRollback.urlImgToRollbacks.length) {
            await AppS3Client.s3DeleteFiles(resRollback.urlImgToRollbacks)
          }
          console.log(err)
          return AppError.json()
        }
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
        resource: EPermissionResource.PRODUCT,
        action: EPermissionAction.DELETE,
      },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const bodyParse = ctx.bodyParse!
        const res = await prisma.product.updateMany({
          where: { id: { in: bodyParse.ids } },
          data: {
            isDeleted: true,
          },
        })
        return AppResponse.json({ status: 200, data: res.count })
      }
    )
  )
)
