import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { AppStatusCode } from "@/common/server/statusCode"
import prisma from "@/lib/prisma"
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client"
import { output } from "zod/v4"
import { IdParamsDTO, PatchUpdateProductDTO } from "./validator"

export const GET = withValidateFieldHandler(
  IdParamsDTO,
  null,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<typeof IdParamsDTO>) => {
        const entity = await prisma.productTag.findUnique({
          where: { id: ctx.paramParse!.id },
        })

        if (!entity) {
          return AppError.json({
            status: 404,
            message: "Product not found",
          })
        }

        return AppResponse.json({ status: 200, data: entity })
      }
    )
  )
)

const syncAttributeValue = async (
  product: Prisma.ProductGetPayload<{
    include: {
      productAttributes: {
        include: {
          productAttributeValues: true
        }
      }
    }
  }>,
  body: output<typeof PatchUpdateProductDTO>
) => {
  const { attributes, skus } = body
  const incomingAttVals = attributes.flatMap((att) => att.productAttValues)
  const incomingAttValIdSet = new Set(incomingAttVals.map((i) => i.id))

  const curAttValIds = product.productAttributes.flatMap((att) =>
    att.productAttributeValues.map((i) => i.id)
  )
  const curAttValIdSet = new Set(curAttValIds)

  const incomingAttValIdsInSku = skus.flatMap((sku) => {
    return sku.productSkuAttVals.map((i) => i.productAttributeValueId)
  })

  const toDeleteValIds = curAttValIds.filter(
    (attValId) => !incomingAttValIdSet.has(attValId)
  )

  if (
    toDeleteValIds.length &&
    toDeleteValIds.some((id) => incomingAttValIdsInSku.includes(id))
  ) {
    return AppError.json({
      message: "Cannot delete Attribute Value",
    })
  }

  const toUpdateVals = incomingAttVals.filter((val) =>
    curAttValIdSet.has(val.id)
  )

  const toCreateVals = incomingAttVals.filter(
    (val) => !curAttValIdSet.has(val.id)
  )

  return {
    toDeleteValIds,
    toUpdateVals,
    toCreateVals,
  }
}

const syncAttribute = async (data: {
  product: Prisma.ProductGetPayload<{
    include: {
      productAttributes: { include: { productAttributeValues: true } }
    }
  }>
  body: output<typeof PatchUpdateProductDTO>
}) => {
  const { product, body } = data
  const { attributes, skus } = body

  const resAttV = await syncAttributeValue(product, body)

  const currentAttributes = product.productAttributes
  const curAttIdSet = new Set(product.productAttributes.map((i) => i.id))
  const incomingAttrIds = new Set(attributes.map((attr) => attr.id))

  const toDeleteAttrIds = currentAttributes
    .filter((attr) => !incomingAttrIds.has(attr.id))
    .map((attr) => attr.id)

  const attIdsInIncomingSku = skus.flatMap((sku) =>
    sku.productSkuAttVals.map((skuAV) => skuAV.productAttributeId)
  )

  if (
    toDeleteAttrIds.length &&
    toDeleteAttrIds.some((id) => attIdsInIncomingSku.includes(id))
  ) {
    return AppError.json({
      message: "Attribute Cannot Deleted",
    })
  }

  const toUpdateAttrs = attributes.filter((attr) => curAttIdSet.has(attr.id))

  const toCreateAttrs = attributes.filter((attr) => !curAttIdSet.has(attr.id))
  if (toCreateAttrs.length) {
    await prisma.productAttribute.createMany({
      data: toCreateAttrs.map(
        (attr) =>
          ({
            id: attr.id,
            productId: product.id,
            attributeId: attr.attributeId,
            displayOrder: attr.displayOrder,
            status: attr.status,
            isUsedForVariations: attr.isUsedForVariations,
          }) as Prisma.ProductAttributeCreateManyInput
      ),
    })
  }
  return {
    resAttV,
    toDeleteAttrIds,
    toUpdateAttrs,
    toCreateAttrs,
  }
}

async function syncSkus(data: {
  product: Prisma.ProductGetPayload<{
    include: {
      productSkus: {
        include: {
          skuAttributeValues: true
        }
      }
    }
  }>
  incomingSkus: output<typeof PatchUpdateProductDTO>["skus"]
}) {
  const { incomingSkus, product } = data
  const curSkus = product.productSkus
  const curSkusIdSet = new Set(product.productSkus.flatMap((sku) => sku.id))

  const incomingSkuIdSet = new Set(incomingSkus.map((sku) => sku.id))

  const toDeleteSkuIds = curSkus
    .filter((sku) => !incomingSkuIdSet.has(sku.id))
    .map((sku) => sku.id)

  const toUpdateSkus = incomingSkus.filter(
    (sku) => sku.id && curSkusIdSet.has(sku.id)
  )
  const toCreateSkus = incomingSkus.filter(
    (sku) => !sku.id || (sku.id && !curSkusIdSet.has(sku.id))
  )

  return {
    toDeleteSkuIds,
    toUpdateSkus,
    toCreateSkus,
  }
}

const syncProductTags = async (data: {
  product: Prisma.ProductGetPayload<{
    include: { productToProductTags: true }
  }>
  productToProductTags: output<
    typeof PatchUpdateProductDTO
  >["productToProductTags"]
}) => {
  const {
    product: { productToProductTags: oldProductToProductTag },
    productToProductTags,
  } = data

  const incomingPToPTagIdSet = new Set(
    productToProductTags.map((tran) => tran.productTagId)
  )
  const curPoToPTagIdSet = new Set(
    oldProductToProductTag.map((tran) => tran.productTagId)
  )
  const pToPTagIdToBeDeletes = oldProductToProductTag
    .filter((tag) => !incomingPToPTagIdSet.has(tag.productTagId))
    .map((i) => i.id)

  const poToPTagToBeUpdates = productToProductTags.filter((tag) =>
    curPoToPTagIdSet.has(tag.productTagId!)
  )
  const poToPTagToBeCreates = productToProductTags.filter(
    (tag) => !curPoToPTagIdSet.has(tag.productTagId)
  )

  return {
    pToPTagIdToBeDeletes,
    poToPTagToBeUpdates,
    poToPTagToBeCreates,
  }
}

const syncProductOptions = async (data: {
  product: Prisma.ProductGetPayload<{
    include: {
      productOptions: {
        include: {
          ProductOptionToOptionItem: true
        }
      }
    }
  }>
  productOpts: output<typeof PatchUpdateProductDTO>["productOpts"]
}) => {
  const {
    product: { productOptions: curProductOption },
    productOpts,
  } = data

  const incomingPOOptionIdSet = new Set(productOpts.map((i) => i.optionId))
  const curPOHash = new Map(curProductOption.map((i) => [i.optionId, i]))
  const curPOOptionIdSet = new Set(curProductOption.map((po) => po.optionId))

  const poToBeDeletes = curProductOption.filter(
    (i) => !incomingPOOptionIdSet.has(i.optionId)
  )
  const poIdToBeDeletes = poToBeDeletes.map((i) => i.id)

  const poToBeUpdates = productOpts.filter((i) =>
    curPOOptionIdSet.has(i.optionId)
  )
  const poToBeCreates = productOpts.filter(
    (i) => !curPOOptionIdSet.has(i.optionId)
  )

  let poToOIIdToBeDeletes: string[] = poToBeDeletes.flatMap((po) =>
    po.ProductOptionToOptionItem.map((poi) => poi.id)
  )

  let totalPOToOIToBeCreates: output<
    typeof PatchUpdateProductDTO
  >["productOpts"][number]["productOptItems"] = poToBeCreates.flatMap(
    (po) => po.productOptItems
  )

  let totalPOToOIToBeUpdates: output<
    typeof PatchUpdateProductDTO
  >["productOpts"][number]["productOptItems"] = []

  poToBeUpdates.forEach((po) => {
    const incomingPOToOI = po.productOptItems
    const incomingPOToOISet = new Set(incomingPOToOI.map((i) => i.optionItemId))
    const curPOToOI =
      curPOHash.get(po.optionId)?.ProductOptionToOptionItem || []
    const curPOToOISet = new Set(curPOToOI.map((i) => i.optionItemId))

    poToOIIdToBeDeletes = poToOIIdToBeDeletes.concat(
      curPOToOI
        .filter((i) => incomingPOToOISet.has(i.optionItemId))
        .map((i) => i.id)
    )

    const poToBeUpdates = incomingPOToOI.filter((i) =>
      curPOToOISet.has(i.optionItemId)
    )

    totalPOToOIToBeUpdates = totalPOToOIToBeUpdates.concat(poToBeUpdates)

    const poToBeCreates = incomingPOToOI.filter(
      (i) => !curPOToOISet.has(i.optionItemId)
    )
    totalPOToOIToBeCreates = totalPOToOIToBeCreates.concat(poToBeCreates)
  })
  return {
    poIdToBeDeletes,
    poToBeUpdates,
    poToBeCreates,
    poToOIIdToBeDeletes,
    totalPOToOIToBeCreates,
    totalPOToOIToBeUpdates,
  }
}

export const PATCH = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PatchUpdateProductDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<
          typeof IdParamsDTO,
          never,
          typeof PatchUpdateProductDTO
        >
      ) => {
        return prisma.$transaction(async () => {
          const { id } = ctx.paramParse!
          const bodyParse = ctx.bodyParse!
          const { code, name, slug, skus, productToProductTags, productOpts } =
            bodyParse

          const productFound = await prisma.product.findUnique({
            where: { id },
            include: {
              productAttributes: { include: { productAttributeValues: true } },
              productSkus: { include: { skuAttributeValues: true } },
              productToProductTags: true,
              brand: true,
              productOptions: {
                include: {
                  ProductOptionToOptionItem: true,
                },
              },
            },
          })

          if (!productFound) {
            return AppError.json({
              status: AppStatusCode.NOT_FOUND,
              message: "Product tag not found",
            })
          }

          if (code || name || slug) {
            const existed = await prisma.product.findFirst({
              where: {
                id: { not: id },
                OR: [{ name }, { slug }, { code }],
              },
            })

            if (existed) {
              let mes = "Code"
              if (existed.name === name) {
                mes = "Name"
              } else if (existed.slug === slug) {
                mes = "Slug"
              }
              return AppError.json({
                status: AppStatusCode.EXISTING,
                message: `${mes} already exist`,
              })
            }
          }

          const objUpdate: Prisma.ProductUncheckedUpdateInput = {
            code,
            name,
            slug,
            avgRateByAdmin: bodyParse.avgRateByAdmin,
            avgRateBySystem: bodyParse.avgRateBySystem,
            brandId: bodyParse.brandId,
            description: bodyParse.description,
            detail: bodyParse.detail,
            isActive: bodyParse.isActive,
            seoDescription: bodyParse.seoDescription,
            mainImage: bodyParse.mainImage,
            listImages: bodyParse.listImages,
            viewCount: bodyParse.viewCount,
            soldCount: bodyParse.soldCount,
            type: bodyParse.type,
            isDeleted: bodyParse.isDeleted,
          }

          const resSyncAtt = syncAttribute({
            product: productFound,
            body: bodyParse!,
          })

          const resSyncSku = syncSkus({
            product: productFound,
            incomingSkus: skus,
          })

          const resSyncPT = syncProductTags({
            product: productFound,
            productToProductTags,
          })

          const resSyncPO = syncProductOptions({
            product: productFound,
            productOpts,
          })

          console.log({
            objUpdate,
            resSyncAtt,
            resSyncSku,
            resSyncPT,
            resSyncPO,
          })

          return AppResponse.json({ status: 200 })
        })
      }
    )
  )
)
