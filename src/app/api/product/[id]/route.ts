import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { EPermissionAction, EPermissionResource, ESkuStatus, Prisma } from "@prisma/client";
import { IdParamsDTO, PatchUpdateBodyDTO } from "./validator";

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
        });

        if (!entity) {
          return AppError.json({
            status: 404,
            message: "Product not found",
          });
        }

        return AppResponse.json({ status: 200, data: entity });
      }
    )
  )
);

export const PATCH = withValidateFieldHandler(
  IdParamsDTO,
  null,
  PatchUpdateBodyDTO,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.PRODUCT,
        action: EPermissionAction.UPDATE,
      },
      async (
        _,
        ctx: THofContext<typeof IdParamsDTO, never, typeof PatchUpdateBodyDTO>
      ) => {
        return prisma.$transaction(async () => {
          const { id } = ctx.paramParse!;
          const {
            code,
            name,
            slug,
            attributes,
            skus,
            translations,
            productTags,
            productOptions,
            ...omit
          } = ctx.bodyParse!;

          const productFound = await prisma.product.findUnique({
            where: { id },
            include: {
              attributes: { include: { attributeValues: true } },
              skus: { include: { skuAttributeValues: true } },
            },
          });

          if (!productFound) {
            return AppError.json({
              status: AppStatusCode.NOT_FOUND,
              message: "Product tag not found",
            });
          }

          if (code || name || slug) {
            const existed = await prisma.product.findFirst({
              where: {
                id: { not: id },
                OR: [{ name }, { slug }, { code }],
              },
            });

            if (existed) {
              let mes = "Code";
              if (existed.name === name) {
                mes = "Name";
              } else if (existed.slug === slug) {
                mes = "Slug";
              }
              return AppError.json({
                status: AppStatusCode.EXISTING,
                message: `${mes} already exist`,
              });
            }
          }

          const objUpdate: Prisma.ProductUpdateInput = {
            code,
            name,
            slug,
            ...omit,
          };

          const incomingSkuIdSet = new Set(skus.map(i => i.id))
          const skuIdToDeletes = productFound.skus.filter(sku => incomingSkuIdSet.has(sku.id)).map(sku => sku.id)
          const skuToUpdates = skus.filter(i => i.id)
          const skuToCreates = skus.filter(i => !i.id)

          if (skuIdToDeletes.length) {
            await prisma.productSku.updateMany({
              where: {
                id: { in: skuIdToDeletes }
              },
              data: {
                status: ESkuStatus.DELETED
              }
            })
          }

          if (skuToUpdates.length) {
            await skuToUpdates.map(sku => prisma.productSku.update({
              where: {
                id: sku.id
              },
              data: {
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
                displayOrder: sku.displayOrder,
                status: sku.status,
                isDefault: sku.isDefault,
              }
            }))
          }

          if (skuToCreates.length) {
            await prisma.productSku.createMany({
              data: skuToCreates.map(sku => ({
                productId: productFound.id,
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
                displayOrder: sku.displayOrder,
                status: sku.status,
                isDefault: sku.isDefault,
              }))
            })
          }


          const incomingAttValIdSet = new Set(attributes.map(att => att.attributeValues.map(attV => attV.id)).flat())
          const skuIdToDeletes = productFound.skus.filter(sku => incomingSkuIdSet.has(sku.id)).map(sku => sku.id)
          const skuToUpdates = skus.filter(i => i.id)
          const skuToCreates = skus.filter(i => !i.id)


          return AppResponse.json({ status: 200 });
        });
      }
    )
  )
);
