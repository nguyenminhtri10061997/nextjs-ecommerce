import { THofContext } from "@/app/api/_lib/HOF/type"
import { withValidateFieldHandler } from "@/app/api/_lib/HOF/withValidateField"
import { withVerifyAccessToken } from "@/app/api/_lib/HOF/withVerifyAccessToken"
import { withVerifyCanDoAction } from "@/app/api/_lib/HOF/withVerifyCanDoAction"
import { AppError } from "@/common/server/appError"
import { AppResponse } from "@/common/server/appResponse"
import { AppStatusCode } from "@/common/server/statusCode"
import prisma from "@/lib/prisma"
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client"
import { v4 } from "uuid"
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

  const incomingAttValIdsInSku = skus.map((sku) => {
    return sku.productSkuAttVal.id
  })

  const toDeleteValIds = curAttValIds.filter(
    (attValId) => !incomingAttValIdSet.has(attValId)
  )

  if (toDeleteValIds.length) {
    if (toDeleteValIds.some((id) => incomingAttValIdsInSku.includes(id))) {
      return AppError.json({
        message: "Cannot delete Attribute Value",
      })
    }
    await prisma.productAttributeValue.deleteMany({
      where: { id: { in: toDeleteValIds } },
    })
  }

  const toUpdateVals = incomingAttVals.filter((val) =>
    curAttValIdSet.has(val.id)
  )
  await Promise.all(
    toUpdateVals.map((val) =>
      prisma.productAttributeValue.update({
        where: { id: val.id },
        data: {
          displayOrder: val.displayOrder,
          status: val.status,
          image: val.image,
        },
      })
    )
  )

  const toCreateVals = incomingAttVals.filter(
    (val) => !curAttValIdSet.has(val.id)
  )

  if (toCreateVals.length) {
    await prisma.productAttributeValue.createMany({
      data: toCreateVals.map(
        (val) =>
          ({
            productAttributeId: val.id,
            displayOrder: val.displayOrder,
            status: val.status,
            image: val.image,
            attributeValueId: val.attributeValueId,
            id: val.id,
          }) as Prisma.ProductAttributeValueCreateManyInput
      ),
    })
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

  await syncAttributeValue(product, body)

  const currentAttributes = product.productAttributes
  const curAttIdSet = new Set(product.productAttributes.map((i) => i.id))
  const incomingAttrIds = new Set(attributes.map((attr) => attr.id))

  const toDeleteAttrIds = currentAttributes
    .filter((attr) => !incomingAttrIds.has(attr.id))
    .map((attr) => attr.id)

  if (toDeleteAttrIds.length) {
    if (
      toDeleteAttrIds.some((id) =>
        skus.some((i) => i.productSkuAttVal.productAttributeId === id)
      )
    ) {
      return AppError.json({
        message: "Attribute Cannot Deleted",
      })
    }
    await prisma.productAttribute.deleteMany({
      where: { id: { in: toDeleteAttrIds }, productId: product.id },
    })
  }

  const toUpdateAttrs = attributes.filter((attr) => curAttIdSet.has(attr.id))
  await Promise.all(
    toUpdateAttrs.map((attr) =>
      prisma.productAttribute.update({
        where: { id: attr.id },
        data: {
          status: attr.status,
          displayOrder: attr.displayOrder,
        },
      })
    )
  )

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
  const curSkusIdSet = new Set(
    product.productSkus.flatMap((sku) =>
      sku.skuAttributeValues.map((skuAtt) => {
        return `${skuAtt.productAttributeId}_${skuAtt.productAttributeValueId}`
      })
    )
  )

  const incomingSkuSet = new Set(
    incomingSkus.map((sku) => {
      const { productSkuAttVal } = sku
      return `${productSkuAttVal.productAttributeId}_${productSkuAttVal.productAttributeValueId}`
    })
  )

  const toDeleteSkuIds = curSkus
    .filter((sku) => !incomingSkuSet.has(sku.id))
    .map((sku) => sku.id)

  if (toDeleteSkuIds.length) {
    await prisma.productSku.deleteMany({
      where: { id: { in: toDeleteSkuIds }, productId: product.id },
    })
  }

  const toUpdateSkus = incomingSkus.filter((sku) => {
    const { productSkuAttVal } = sku
    return curSkusIdSet.has(
      `${productSkuAttVal.productAttributeId}_${productSkuAttVal.productAttributeValueId}`
    )
  })
  await Promise.all(
    toUpdateSkus.map((sku) =>
      prisma.productSku.update({
        where: { productId: product.id,  },
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
          displayOrder: sku.displayOrder,
          status: sku.status,
          downloadUrl: sku.downloadUrl,
          isDefault: sku.isDefault,
        },
      })
    )
  )

  const toCreateSkus = incomingSkus.filter(
    (sku) => !sku.id || (sku.id && currentSkuIds.includes(sku.id))
  )
  if (toCreateSkus.length) {
    await prisma.productSku.createMany({
      data: toCreateSkus.map(
        (sku) =>
          ({
            productId: product.id,
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
            displayOrder: sku.displayOrder,
            status: sku.status,
            downloadUrl: sku.downloadUrl,
            isDefault: sku.isDefault,
          }) as Prisma.ProductSkuCreateManyInput
      ),
    })
    await prisma.productSkuAttributeValue.createMany({
      data: toCreateSkus.map(
        (i) =>
          ({
            ...i.productSkuAttVal,
          }) as Prisma.ProductSkuAttributeValueCreateManyInput
      ),
    })
  }
}

const syncProductTags = async (data: {
  product: Prisma.ProductGetPayload<{
    include: { productToProductTags: true }
  }>
  productTags: output<typeof PatchUpdateProductDTO>["productToProductTags"]
}) => {
  const {
    product: { id: productId, productToProductTags: oldProductToProductTag },
    productTags,
  } = data

  const incomingProductTagIdsMap = new Set(
    productTags.map((tran) => tran.productTagId)
  )
  const curProductTagIdsMap = new Set(
    oldProductToProductTag.map((tran) => tran.productTagId)
  )
  const tagToBeDeletes = oldProductToProductTag.filter(
    (tag) => !incomingProductTagIdsMap.has(tag.productTagId)
  )

  const tagToBeUpdates = productTags.filter((tag) =>
    curProductTagIdsMap.has(tag.productTagId!)
  )
  const tagToBeCreates = productTags.filter(
    (tag) => !curProductTagIdsMap.has(tag.productTagId)
  )

  if (tagToBeDeletes.length) {
    await prisma.productTag.deleteMany({
      where: {
        id: { in: tagToBeDeletes.map((i) => i.id) },
      },
    })
  }

  await Promise.all(
    tagToBeUpdates.map((tag) =>
      prisma.productToProductTag.update({
        where: {
          productId_productTagId: {
            productId,
            productTagId: tag.productTagId,
          },
        },
        data: {
          expiredAt: tag.expiredAt,
        },
      })
    )
  )

  if (tagToBeCreates.length) {
    prisma.productToProductTag.createMany({
      data: tagToBeCreates.map(
        (tag) =>
          ({
            productId,
            productTagId: tag.productTagId,
            expiredAt: tag.expiredAt,
          }) as Prisma.ProductToProductTagCreateManyInput
      ),
    })
  }
}

const syncProductOptions = async (data: {
  product: Prisma.ProductGetPayload<{
    include: {
      productOptions: true
    }
  }>
  productOptions: output<typeof PatchUpdateProductDTO>["productOpts"]
}) => {
  const {
    product: { productOptions: oldProductToOption },
    productOptions,
  } = data

  const incomingProductToOptionIdSet = new Set<string>()
  const incomingPTOToOptionIdSet = new Set<string>()

  const curProductToOptionIdMap = new Map<
    string,
    (typeof oldProductToOption)[number]
  >()
  const curPTOToOptionItemIdSet = new Set<string>()

  productOptions.forEach((po) => {
    incomingProductToOptionIdSet.add(po.pro)

    po.productOptItems?.forEach((poi) => {
      incomingPTOToOptionIdSet.add(poi.optionItemId)
    })
  })
  const productToOptionIdToBeDeletes: string[] = []
  let productToOptionToOptionItemToBeDeletes: string[] = []

  oldProductToOption.forEach((pto) => {
    curProductToOptionIdMap.set(pto.optionId, pto)
    pto.productToOptionToOptionItem.forEach((ptoTOI) => {
      curPTOToOptionItemIdSet.add(ptoTOI.optionItemId)
    })

    if (!incomingProductToOptionIdSet.has(pto.optionId)) {
      productToOptionIdToBeDeletes.push(pto.id)
      productToOptionToOptionItemToBeDeletes =
        productToOptionToOptionItemToBeDeletes.concat(
          pto.productToOptionToOptionItem.map((i) => i.id)
        )
    }
  })

  const productToOptionToBeUpdates: Prisma.ProductToOptionUpdateArgs[] = []
  const productToOptionToBeCreates: Prisma.ProductToOptionCreateManyInput[] = []

  const productToOptionToOptionItemToBeUpdates: Prisma.ProductToOptionToOptionItemUpdateArgs[] =
    []
  let productToOptionToOptionItemToBeCreates: Prisma.ProductToOptionToOptionItemCreateManyInput[] =
    []

  productOptions.forEach((po) => {
    const existPO = curProductToOptionIdMap.get(po.optionId)
    if (existPO) {
      productToOptionToBeUpdates.push({
        where: {
          productId_optionId: {
            productId,
            optionId: po.optionId,
          },
        },
        data: {
          displayOrder: po.displayOrder,
          isRequired: po.isRequired,
          maxSelect: po.maxSelect,
        },
      })
      po.optionItems?.forEach((oi) => {
        const existsTOI = curPTOToOptionItemIdSet.has(oi.optionItemId)
        if (existsTOI) {
          productToOptionToOptionItemToBeUpdates.push({
            where: {
              productToOptionId_optionItemId: {
                optionItemId: oi.optionItemId,
                productToOptionId: existPO.id,
              },
            },
            data: {
              displayOrder: oi.displayOrder,
              priceModifierType: oi.priceModifierType,
              priceModifierValue: oi.priceModifierValue,
            },
          })
        } else {
          productToOptionToOptionItemToBeCreates.push({
            optionItemId: oi.optionItemId,
            productToOptionId: existPO.id,
            displayOrder: oi.displayOrder,
            priceModifierType: oi.priceModifierType,
            priceModifierValue: oi.priceModifierValue,
          })
        }
      })
    } else {
      const newPto: Prisma.ProductToOptionCreateManyInput = {
        id: v4(),
        productId,
        optionId: po.optionId,
        displayOrder: po.displayOrder,
        isRequired: po.isRequired,
        maxSelect: po.maxSelect,
      }
      productToOptionToBeCreates.push(newPto)
      if (po.optionItems.length) {
        productToOptionToOptionItemToBeCreates =
          productToOptionToOptionItemToBeCreates.concat(
            po.optionItems.map(
              (oi) =>
                ({
                  optionItemId: oi.optionItemId,
                  productToOptionId: newPto.id,
                  displayOrder: oi.displayOrder,
                  priceModifierType: oi.priceModifierType,
                  priceModifierValue: oi.priceModifierValue,
                }) as Prisma.ProductToOptionToOptionItemCreateManyInput
            )
          )
      }
    }
  })

  await Promise.all(
    [
      productToOptionToBeUpdates.map((data) =>
        prisma.productToOption.update(data)
      ),
      productToOptionToOptionItemToBeUpdates.map((data) =>
        prisma.productToOptionToOptionItem.update(data)
      ),
      productToOptionToBeCreates.length &&
        prisma.productToOption.createMany({
          data: productToOptionToBeCreates,
        }),
      productToOptionIdToBeDeletes.length &&
        prisma.productToOption.deleteMany({
          where: {
            id: { in: productToOptionIdToBeDeletes },
          },
        }),
      productToOptionToOptionItemToBeDeletes.length &&
        prisma.productToOptionToOptionItem.deleteMany({
          where: {
            id: { in: productToOptionToOptionItemToBeDeletes },
          },
        }),
    ].filter(Boolean)
  )

  if (productToOptionToOptionItemToBeCreates.length) {
    await prisma.productToOptionToOptionItem.createMany({
      data: productToOptionToOptionItemToBeCreates,
    })
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
          const { bodyParse } = ctx
          const {
            code,
            name,
            slug,
            skus,
            attributes,
            productOpts,
            productToProductTags,
            ...omit
          } = bodyParse!

          const productFound = await prisma.product.findUnique({
            where: { id },
            include: {
              productAttributes: { include: { productAttributeValues: true } },
              productSkus: { include: { skuAttributeValues: true } },
              productToProductTags: true,
              brand: true,
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

          const objUpdate: Prisma.ProductUpdateInput = {
            code,
            name,
            slug,
            ...omit,
          }
          // await prisma.product.update({
          //   where: { id: productFound.id },
          //   data: objUpdate,
          // })

          await syncAttribute({
            product: productFound,
            body: bodyParse!,
          })

          await syncSkus({
            product: productFound,
            incomingSkus: skus,
          })

          if (productTags) {
            await syncProductTags({ product, productTags })
          }

          if (productOptions) {
            await syncProductOptions({
              productId: productFound.id,
              productOptions,
            })
          }

          return AppResponse.json({ status: 200 })
        })
      }
    )
  )
)
