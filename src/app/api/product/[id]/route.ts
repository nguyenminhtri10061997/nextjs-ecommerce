import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { AppStatusCode } from "@/common/statusCode";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import {
  EAttributeValueStatus,
  EPermissionAction,
  EPermissionResource,
  ESkuStatus,
  Prisma,
} from "@prisma/client";
import { output } from "zod/v4";
import {
  IdParamsDTO,
  PatchUpdateBodyDTO,
  ProductAttributeDTO,
  ProductAttributeValueDTO,
  ProductSkuDTO,
  ProductTagDTO,
  ProductToOptionDTO,
  TranslationDTO,
} from "./validator";
import { v4 } from "uuid";

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

async function updateProduct(
  productId: string,
  data: Prisma.ProductUpdateInput
) {
  return prisma.product.update({ where: { id: productId }, data });
}

const syncAttribute = async (data: {
  product: Prisma.ProductGetPayload<{
    include: { attributes: { include: { attributeValues: true } } };
  }>;
  attributes: output<typeof ProductAttributeDTO>[];
}) => {
  const { product, attributes } = data;

  const currentAttributes = product.attributes;
  const incomingAttrIds = new Set(
    attributes.map((attr) => attr.id).filter(Boolean)
  );

  // Xóa (soft delete) attribute
  const toDeleteAttrIds = currentAttributes
    .filter((attr) => !incomingAttrIds.has(attr.id))
    .map((attr) => attr.id);

  if (toDeleteAttrIds.length) {
    await prisma.productAttribute.updateMany({
      where: { id: { in: toDeleteAttrIds }, productId: product.id },
      data: { status: ESkuStatus.DELETED },
    });
  }

  // Cập nhật attribute
  const toUpdateAttrs = attributes.filter((attr) => attr.id);
  await Promise.all(
    toUpdateAttrs.map((attr) =>
      prisma.productAttribute.update({
        where: { id: attr.id },
        data: {
          name: attr.name,
          slug: attr.slug,
          displayOrder: attr.displayOrder,
          status: attr.status,
        },
      })
    )
  );

  // Tạo mới attribute
  const toCreateAttrs = attributes
    .filter((attr) => !attr.id)
    .map((att) => ({ ...att, id: v4() }));
  if (toCreateAttrs.length) {
    await prisma.productAttribute.createMany({
      data: toCreateAttrs.map((attr) => ({
        id: attr.id,
        productId: product.id,
        name: attr.name,
        slug: attr.slug,
        displayOrder: attr.displayOrder,
        status: attr.status,
      })),
    });
  }

  const incomingAttValues = attributes.flatMap((attr) => attr.attributeValues);

  const currentAttrValues = currentAttributes.flatMap(
    (attr) => attr.attributeValues
  );
  const incomingAttValIds = new Set(
    incomingAttValues.map((val) => val.id).filter(Boolean)
  );
  const toDeleteValIds = currentAttrValues
    .filter((val) => !incomingAttValIds.has(val.id))
    .map((val) => val.id);

  if (toDeleteValIds.length) {
    await prisma.productAttributeValue.updateMany({
      where: { id: { in: toDeleteValIds } },
      data: { status: EAttributeValueStatus.DELETED },
    });
  }

  const toUpdateVals = incomingAttValues.filter((val) => val.id);
  await Promise.all(
    toUpdateVals.map((val) =>
      prisma.productAttributeValue.update({
        where: { id: val.id },
        data: {
          name: val.name,
          slug: val.slug,
          displayOrder: val.displayOrder,
          status: val.status,
          image: val.image,
        },
      })
    )
  );

  let toCreateVals: output<typeof ProductAttributeValueDTO>[] =
    toCreateAttrs.flatMap((att) => att.attributeValues);
  attributes.forEach((att) => {
    if (att.id) {
      toCreateVals = toCreateVals.concat(
        att.attributeValues.filter((attV) => !attV.id)
      );
    }
  });
  if (toCreateVals.length) {
    await prisma.productAttributeValue.createMany({
      data: toCreateVals.map((val) => ({
        productAttributeId: val.id,
        name: val.name,
        slug: val.slug,
        displayOrder: val.displayOrder,
        status: val.status,
        image: val.image,
      })),
    });
  }
};

async function syncSkus(data: {
  product: Prisma.ProductGetPayload<{
    include: { skus: true };
  }>;
  incomingSkus: output<typeof ProductSkuDTO>[];
}) {
  const { incomingSkus, product } = data;
  const currentSkus = product.skus;
  const incomingSkuIds = new Set(
    incomingSkus.map((sku) => sku.id).filter(Boolean)
  );

  const toDeleteSkuIds = currentSkus
    .filter((sku) => !incomingSkuIds.has(sku.id))
    .map((sku) => sku.id);

  if (toDeleteSkuIds.length) {
    await prisma.productSku.updateMany({
      where: { id: { in: toDeleteSkuIds } },
      data: { status: ESkuStatus.DELETED },
    });
  }

  const toUpdateSkus = incomingSkus.filter((sku) => sku.id);
  await Promise.all(
    toUpdateSkus.map((sku) =>
      prisma.productSku.update({
        where: { id: sku.id },
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
        },
      })
    )
  );

  const toCreateSkus = incomingSkus.filter((sku) => !sku.id);
  if (toCreateSkus.length) {
    await prisma.productSku.createMany({
      data: toCreateSkus.map((sku) => ({
        productId: product.id,
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
      })),
    });
  }
}

const syncProductTags = async (data: {
  productId: string;
  productTags: output<typeof ProductTagDTO>[];
}) => {
  const { productId, productTags } = data;
  const oldProductToProductTag = await prisma.productToProductTag.findMany({
    where: {
      productId,
    },
  });

  const incomingProductTagIdsMap = new Set(
    productTags.map((tran) => tran.productTagId)
  );
  const curProductTagIdsMap = new Set(
    oldProductToProductTag.map((tran) => tran.productTagId)
  );
  const tagToBeDeletes = oldProductToProductTag.filter(
    (tag) => !incomingProductTagIdsMap.has(tag.productTagId)
  );

  const tagToBeUpdates = productTags.filter((tag) =>
    curProductTagIdsMap.has(tag.productTagId)
  );
  const tagToBeCreates = productTags.filter(
    (tag) => !curProductTagIdsMap.has(tag.productTagId)
  );

  if (tagToBeDeletes.length) {
    await prisma.productTag.deleteMany({
      where: {
        id: { in: tagToBeDeletes.map((i) => i.id) },
      },
    });
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
  );

  if (tagToBeCreates) {
    prisma.productToProductTag.createMany({
      data: tagToBeCreates.map(
        (tag) =>
          ({
            productId,
            productTagId: tag.productTagId,
            expiredAt: tag.expiredAt,
          } as Prisma.ProductToProductTagCreateManyInput)
      ),
    });
  }
};


const syncProductOptions = async (data: {
  productId: string;
  productOptions: output<typeof ProductToOptionDTO>[];
}) => {
  const { productId, productOptions } = data;
  const oldProductToProductToOption = await prisma.productToOption.findMany({
    where: {
      productId,
    },
    select: {
      id: true,
      optionId: true,
      ProductToOptionToOptionItem: {
        select: {
          id: true
        }
      }
    },
  });

  const incomingProductToOptionIdsMap = new Set(
    productOptions.map((item) => item.optionId)
  );

  const curProductToOptionIdsMap = new Set(
    oldProductToProductToOption.map((item) => item.optionId)
  );

  const productToOptionToBeDeletes = oldProductToProductToOption.filter(
    (item) => !incomingProductToOptionIdsMap.has(item.optionId)
  );

  const productToOptionToBeUpdates = productOptions.filter((po) => curProductToOptionIdsMap.has(po.optionId));


  const productToOptionToBeCreates = productOptions.filter(
    (item) => !curProductToOptionIdsMap.has(item.optionId)
  );

  if (productToOptionToBeDeletes.length) {
    await prisma.productTag.deleteMany({
      where: {
        id: { in: productToOptionToBeDeletes.map((i) => i.id) },
      },
    });
  }

  await Promise.all(
    productToOptionToBeUpdates.map((item) =>
      prisma.productToOption.update({
        where: {
          productId_optionId: {
            productId,
            optionId: item.optionId,
          },
        },
        data: {
          
        },
      })
    )
  );

  if (tagToBeCreates) {
    prisma.productToProductToOption.createMany({
      data: tagToBeCreates.map(
        (tag) =>
          ({
            productId,
            productTagId: tag.productTagId,
            expiredAt: tag.expiredAt,
          } as Prisma.ProductToProductToOptionCreateManyInput)
      ),
    });
  }
};

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
            skus,
            attributes,
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

          await updateProduct(id, objUpdate);

          await syncAttribute({
            product: productFound,
            attributes,
          });

          await syncSkus({
            product: productFound,
            incomingSkus: skus,
          });

          if (productTags) {
            await syncProductTags({ productId: productFound.id, productTags });
          }

          if (productOptions) {
            await syncProductOptions({ productId: productFound.id, productOptions })
          }

          return AppResponse.json({ status: 200 });
        });
      }
    )
  )
);
