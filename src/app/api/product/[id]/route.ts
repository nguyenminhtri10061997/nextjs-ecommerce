import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { AppStatusCode } from "@/common/server/statusCode"
import prisma from "@/lib/prisma"
import AppS3Client from "@/lib/s3"
import {
  EPermissionAction,
  EPermissionResource,
  EStockType,
  Prisma,
  ProductAttributeValue,
} from "@prisma/client"
import { NextResponse } from "next/server"
import { output } from "zod/v4"
import { IdParamsDTO, PatchUpdateProductDTO } from "./validator"

type TImageMigrationTracker = {
  tempKeysToDelete: string[]
  finalKeysToRollback: string[]
}

const createImageTracker = (): TImageMigrationTracker => ({
  tempKeysToDelete: [],
  finalKeysToRollback: [],
})

const isTempKey = (key?: string | null) =>
  typeof key === "string" && key.startsWith(`${AppS3Client.TEMP_FOLDER}/`)

const moveTempImageToFinal = async ({
  key,
  tracker,
}: {
  key: string
  tracker: TImageMigrationTracker
}) => {
  const finalKey = await AppS3Client.copyFromTempToFinalS3File(key)
  if (finalKey) {
    tracker.finalKeysToRollback.push(finalKey)
    tracker.tempKeysToDelete.push(key)
  }
  return finalKey
}

const normalizeIncomingProductImages = async ({
  body,
  tracker,
}: {
  body: output<typeof PatchUpdateProductDTO>
  tracker: TImageMigrationTracker
}) => {
  if (body.mainImage && isTempKey(body.mainImage)) {
    const normalized = await moveTempImageToFinal({
      key: body.mainImage,
      tracker,
    })
    if (normalized) {
      body.mainImage = normalized
    }
  }

  if (Array.isArray(body.listImages) && body.listImages.length) {
    body.listImages = await Promise.all(
      body.listImages.map(async (img) => {
        if (!img || !isTempKey(img)) return img
        const normalized = await moveTempImageToFinal({
          key: img,
          tracker,
        })
        return normalized || img
      })
    )
  }

  if (Array.isArray(body.attributes) && body.attributes.length) {
    await Promise.all(
      body.attributes.map(async (attr) => {
        if (!Array.isArray(attr.productAttValues)) return
        await Promise.all(
          attr.productAttValues.map(async (attVal) => {
            if (!attVal.image || !isTempKey(attVal.image)) return
            const normalized = await moveTempImageToFinal({
              key: attVal.image,
              tracker,
            })
            if (normalized) {
              attVal.image = normalized
            }
          })
        )
      })
    )
  }

  if (Array.isArray(body.skus) && body.skus.length) {
    await Promise.all(
      body.skus.map(async (sku) => {
        if (!sku?.image || !isTempKey(sku.image)) return
        const normalized = await moveTempImageToFinal({
          key: sku.image,
          tracker,
        })
        if (normalized) {
          sku.image = normalized
        }
      })
    )
  }
}

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
        const entity = await prisma.product.findUnique({
          where: { id: ctx.paramParse!.id },
          include: {
            productAttributes: {
              include: {
                productAttributeValues: true,
              },
            },
            productOptions: {
              include: {
                ProductOptionToOptionItem: true,
              },
            },
            productSkus: {
              include: {
                skuAttributeValues: true,
              },
            },
            productToProductTags: true,
          },
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
  const { attributes = [], skus = [] } = body
  const incomingAttVals = attributes.flatMap((att) =>
    att.productAttValues.map((attVal) => ({
      ...attVal,
      productAttributeId: att.id,
    }))
  )
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

type TResAttV = {
  toDeleteValIds: string[]
  toUpdateVals: ProductAttributeValue[]
  toCreateVals: ProductAttributeValue[]
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
  const { attributes = [], skus = [] } = body

  const resAttV = await syncAttributeValue(product, body)
  if (resAttV instanceof NextResponse) {
    return resAttV
  }

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

  return {
    resAttV: resAttV as TResAttV,
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
    productToProductTags = [],
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
    productOpts = [],
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

type TAttributeSyncResult = Exclude<
  Awaited<ReturnType<typeof syncAttribute>>,
  Response
>

const applyProductAttributeMutations = async ({
  tx,
  productId,
  syncResult,
}: {
  tx: Prisma.TransactionClient
  productId: string
  syncResult: TAttributeSyncResult
}) => {
  const { resAttV, toCreateAttrs, toDeleteAttrIds, toUpdateAttrs } = syncResult
  const { toDeleteValIds = [], toUpdateVals = [], toCreateVals = [] } = resAttV

  if (toDeleteValIds.length) {
    await tx.productSkuAttributeValue.deleteMany({
      where: { productAttributeValueId: { in: toDeleteValIds } },
    })
    await tx.productAttributeValue.deleteMany({
      where: { id: { in: toDeleteValIds } },
    })
  }

  if (toDeleteAttrIds.length) {
    await tx.productSkuAttributeValue.deleteMany({
      where: { productAttributeId: { in: toDeleteAttrIds } },
    })
    await tx.productAttributeValue.deleteMany({
      where: { productAttributeId: { in: toDeleteAttrIds } },
    })
    await tx.productAttribute.deleteMany({
      where: { id: { in: toDeleteAttrIds } },
    })
  }

  if (toUpdateAttrs.length) {
    await Promise.all(
      toUpdateAttrs.map((attr) =>
        tx.productAttribute.update({
          where: { id: attr.id },
          data: {
            attributeId: attr.attributeId,
            displayOrder: attr.displayOrder,
            status: attr.status,
            isUsedForVariations: attr.isUsedForVariations,
          },
        })
      )
    )
  }

  if (toCreateAttrs.length) {
    await tx.productAttribute.createMany({
      data: toCreateAttrs.map(
        (attr) =>
          ({
            id: attr.id,
            productId,
            attributeId: attr.attributeId,
            displayOrder: attr.displayOrder,
            status: attr.status,
            isUsedForVariations: attr.isUsedForVariations,
          }) as Prisma.ProductAttributeCreateManyInput
      ),
    })
  }

  if (toUpdateVals.length) {
    await Promise.all(
      toUpdateVals.map((val) =>
        tx.productAttributeValue.update({
          where: { id: val.id },
          data: {
            attributeValueId: val.attributeValueId,
            image: val.image,
            displayOrder: val.displayOrder,
            status: val.status,
          },
        })
      )
    )
  }

  if (toCreateVals.length) {
    await tx.productAttributeValue.createMany({
      data: toCreateVals.map(
        (val) =>
          ({
            id: val.id,
            productAttributeId: val.productAttributeId,
            attributeValueId: val.attributeValueId,
            image: val.image,
            displayOrder: val.displayOrder,
            status: val.status,
          }) as Prisma.ProductAttributeValueCreateManyInput
      ),
    })
  }
}

const applySkuMutations = async ({
  tx,
  productId,
  skuSyncResult,
}: {
  tx: Prisma.TransactionClient
  productId: string
  skuSyncResult: Awaited<ReturnType<typeof syncSkus>>
}) => {
  const { toCreateSkus, toDeleteSkuIds, toUpdateSkus } = skuSyncResult

  if (toDeleteSkuIds.length) {
    await tx.productSkuAttributeValue.deleteMany({
      where: { productSkuId: { in: toDeleteSkuIds } },
    })
    await tx.productSku.deleteMany({
      where: { id: { in: toDeleteSkuIds } },
    })
  }

  for (const sku of toUpdateSkus) {
    if (!sku.id) continue
    await tx.productSku.update({
      where: { id: sku.id },
      data: {
        sellerSku: sku.sellerSku,
        stockStatus: sku.stockStatus,
        stockType: sku.stockType,
        image: sku.image,
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
        status: sku.status,
        isDefault: sku.isDefault,
        displayOrder: sku.displayOrder,
        downloadUrl: sku.downloadUrl,
      },
    })

    await tx.productSkuAttributeValue.deleteMany({
      where: { productSkuId: sku.id },
    })

    if (sku.productSkuAttVals?.length) {
      await tx.productSkuAttributeValue.createMany({
        data: sku.productSkuAttVals.map((attVal) => ({
          productSkuId: sku.id!,
          productAttributeId: attVal.productAttributeId,
          productAttributeValueId: attVal.productAttributeValueId,
        })),
      })
    }
  }

  for (const sku of toCreateSkus) {
    await tx.productSku.create({
      data: {
        id: sku.id,
        productId,
        sellerSku: sku.sellerSku,
        stockStatus: sku.stockStatus,
        stockType: sku.stockType as EStockType,
        image: sku.image,
        salePrice: sku.salePrice,
        price: sku.price!,
        costPrice: sku.costPrice,
        stock: sku.stock,
        barcode: sku.barcode,
        weight: sku.weight,
        width: sku.width,
        height: sku.height,
        length: sku.length,
        note: sku.note,
        status: sku.status!,
        isDefault: sku.isDefault,
        displayOrder: sku.displayOrder,
        downloadUrl: sku.downloadUrl,
        skuAttributeValues: sku.productSkuAttVals?.length
          ? {
              create: sku.productSkuAttVals.map((attVal) => ({
                productAttributeId: attVal.productAttributeId,
                productAttributeValueId: attVal.productAttributeValueId,
              })),
            }
          : undefined,
      },
    })
  }
}

const applyProductTagMutations = async ({
  tx,
  productId,
  tagSyncResult,
}: {
  tx: Prisma.TransactionClient
  productId: string
  tagSyncResult: Awaited<ReturnType<typeof syncProductTags>>
}) => {
  const { pToPTagIdToBeDeletes, poToPTagToBeCreates, poToPTagToBeUpdates } =
    tagSyncResult

  if (pToPTagIdToBeDeletes.length) {
    await tx.productToProductTag.deleteMany({
      where: { id: { in: pToPTagIdToBeDeletes } },
    })
  }

  if (poToPTagToBeCreates.length) {
    await tx.productToProductTag.createMany({
      data: poToPTagToBeCreates.map((tag) => ({
        productId,
        productTagId: tag.productTagId!,
        expiredAt: tag.expiredAt,
      })),
    })
  }

  for (const tag of poToPTagToBeUpdates) {
    await tx.productToProductTag.update({
      where: {
        productId_productTagId: {
          productId,
          productTagId: tag.productTagId!,
        },
      },
      data: {
        expiredAt: tag.expiredAt,
      },
    })
  }
}

const applyProductOptionMutations = async ({
  tx,
  productId,
  productOptionsSnapshot,
  optionSyncResult,
}: {
  tx: Prisma.TransactionClient
  productId: string
  productOptionsSnapshot: Prisma.ProductGetPayload<{
    include: {
      productOptions: {
        include: {
          ProductOptionToOptionItem: true
        }
      }
    }
  }>["productOptions"]
  optionSyncResult: Awaited<ReturnType<typeof syncProductOptions>>
}) => {
  const { poIdToBeDeletes, poToBeCreates, poToBeUpdates } = optionSyncResult

  if (poIdToBeDeletes.length) {
    await tx.productOptionToOptionItem.deleteMany({
      where: { productOptionId: { in: poIdToBeDeletes } },
    })
    await tx.productOption.deleteMany({
      where: { id: { in: poIdToBeDeletes } },
    })
  }

  const optionByOptionId = new Map(
    productOptionsSnapshot.map((po) => [po.optionId, po])
  )

  for (const option of poToBeUpdates) {
    const existed = optionByOptionId.get(option.optionId)
    if (!existed) continue

    await tx.productOption.update({
      where: { id: existed.id },
      data: {
        displayOrder: option.displayOrder,
        isRequired: option.isRequired,
        maxSelect: option.maxSelect,
      },
    })

    await tx.productOptionToOptionItem.deleteMany({
      where: { productOptionId: existed.id },
    })

    if (option.productOptItems?.length) {
      await tx.productOptionToOptionItem.createMany({
        data: option.productOptItems.map((item) => ({
          productOptionId: existed.id,
          optionItemId: item.optionItemId!,
          displayOrder: item.displayOrder,
          priceModifierType: item.priceModifierType!,
          priceModifierValue: item.priceModifierValue!,
        })),
      })
    }
  }

  for (const option of poToBeCreates) {
    const created = await tx.productOption.create({
      data: {
        productId,
        optionId: option.optionId,
        displayOrder: option.displayOrder,
        isRequired: option.isRequired,
        maxSelect: option.maxSelect,
      },
    })

    if (option.productOptItems?.length) {
      await tx.productOptionToOptionItem.createMany({
        data: option.productOptItems.map((item) => ({
          productOptionId: created.id,
          optionItemId: item.optionItemId!,
          displayOrder: item.displayOrder,
          priceModifierType: item.priceModifierType!,
          priceModifierValue: item.priceModifierValue!,
        })),
      })
    }
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
        const imageTracker = createImageTracker()

        try {
          const response = await prisma.$transaction(async (tx) => {
            const { id } = ctx.paramParse!
            const bodyParse = ctx.bodyParse!

            const productFound = await tx.product.findUnique({
              where: { id },
              include: {
                productAttributes: {
                  include: { productAttributeValues: true },
                },
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

            await normalizeIncomingProductImages({
              body: bodyParse,
              tracker: imageTracker,
            })

            const {
              code,
              name,
              slug,
              skus = [],
              productToProductTags = [],
              productOpts = [],
            } = bodyParse

            if (code || name || slug) {
              const existed = await tx.product.findFirst({
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

            const hasScalarUpdate = Object.values(objUpdate).some(
              (value) => value !== undefined
            )

            if (hasScalarUpdate) {
              await tx.product.update({
                where: { id },
                data: objUpdate,
              })
            }

            const resSyncAtt = await syncAttribute({
              product: productFound,
              body: bodyParse!,
            })

            if (resSyncAtt instanceof Response) {
              return resSyncAtt
            }

            const resSyncSku = await syncSkus({
              product: productFound,
              incomingSkus: skus,
            })

            const resSyncPT = await syncProductTags({
              product: productFound,
              productToProductTags,
            })

            const resSyncPO = await syncProductOptions({
              product: productFound,
              productOpts,
            })

            await applyProductAttributeMutations({
              tx,
              productId: productFound.id,
              syncResult: resSyncAtt,
            })

            await applySkuMutations({
              tx,
              productId: productFound.id,
              skuSyncResult: resSyncSku,
            })

            await applyProductTagMutations({
              tx,
              productId: productFound.id,
              tagSyncResult: resSyncPT,
            })

            await applyProductOptionMutations({
              tx,
              productId: productFound.id,
              productOptionsSnapshot: productFound.productOptions,
              optionSyncResult: resSyncPO,
            })

            return AppResponse.json({ status: 200 })
          })

          if (response?.ok) {
            if (imageTracker.tempKeysToDelete.length) {
              await AppS3Client.s3DeleteFiles(imageTracker.tempKeysToDelete)
            }
          } else {
            if (imageTracker.finalKeysToRollback.length) {
              await AppS3Client.s3DeleteFiles(imageTracker.finalKeysToRollback)
            }
          }

          return response
        } catch (error) {
          if (imageTracker.finalKeysToRollback.length) {
            await AppS3Client.s3DeleteFiles(imageTracker.finalKeysToRollback)
          }
          console.error(error)
          return AppError.json()
        }
      }
    )
  )
)
