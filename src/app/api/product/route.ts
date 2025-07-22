import {
  getOrderBy,
  getSkipAndTake,
  getUrlFromPromiseSettledResult,
} from "@/common";
import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator";
import dayjs from "dayjs";
import { TGetProductListResponse } from "@/types/api/product";
import AppS3Client from "@/lib/s3";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      { resource: EPermissionResource.PRODUCT, action: EPermissionAction.READ },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery, pagination, dateRangeQuery } =
          ctx.queryParse || {};
        const where: Prisma.ProductWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.ProductWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.equals]:
              searchQuery.searchStr,
          } as never;
        }

        if (dateRangeQuery?.startDate && dateRangeQuery?.endDate) {
          where["createdAt"] = {
            gte: dayjs(dateRangeQuery.startDate).startOf("d").toDate(),
            lte: dayjs(dateRangeQuery.endDate).startOf("d").toDate(),
          };
        }

        const { skip, take } = getSkipAndTake(pagination);

        const findManyArgs: Prisma.ProductFindManyArgs = {
          where,
          skip,
          take,
          orderBy: getOrderBy(orderQuery),
        };

        const [data, count] = await Promise.all([
          prisma.product.findMany(findManyArgs),
          skip && take ? prisma.product.count({ where }) : undefined,
        ]);

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
        });
      }
    )
  )
);

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
        } = ctx.bodyParse!;

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
        });
        if (exists) {
          return AppError.json({
            status: 409,
            message: `${exists.name === name ? "name" : "slug"} already exists`,
          });
        }

        const s3CreateFilesRes = await AppS3Client.s3CreateFiles(
          ([] as (File | null | undefined)[])
            .concat(mainImage)
            .concat(listImages)
            .concat(
              attributes.flatMap((i) => i.attributeValues.map((av) => av.image))
            )
            .concat(skus.map((sku) => sku.image))
        );
        let imageCursor = 0;

        const objCreate: Prisma.ProductCreateInput = {
          code,
          name,
          slug,
          mainImage: getUrlFromPromiseSettledResult(
            s3CreateFilesRes[imageCursor++]
          ),
          listImages: [],
          ...omit,
        };

        if (listImages?.length) {
          objCreate.listImages = listImages
            .map(() =>
              getUrlFromPromiseSettledResult(s3CreateFilesRes[imageCursor++])
            )
            .filter((i) => i !== null);
        }

        if (attributes?.length) {
          objCreate.attributes = {
            create: attributes.map((at) => ({
              id: at.id,
              name: at.name,
              slug: at.slug,
              type: at.type,
              displayOrder: at.displayOrder,
              status: at.status,

              attributeValues: {
                create: at.attributeValues.map(
                  (atv) =>
                    ({
                      id: atv.id,
                      image: getUrlFromPromiseSettledResult(
                        s3CreateFilesRes[imageCursor++]
                      ),
                      slug: atv.slug,
                      name: atv.name,
                      displayOrder: atv.displayOrder,
                      status: atv.status,
                    } as Prisma.ProductAttributeValueCreateInput)
                ),
              },
            })),
          };
        }

        if (skus?.length) {
          objCreate.skus = {
            create: skus.map(
              (sku) =>
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
                  image: getUrlFromPromiseSettledResult(
                    s3CreateFilesRes[imageCursor++]
                  ),
                  status: sku.status,
                  isDefault: sku.isDefault,
                  displayOrder: sku.displayOrder,
                  downloadUrl: sku.downloadUrl,
                  skuAttributeValues: {
                    create: sku.skuAttributeValues,
                  },
                } as Prisma.ProductSkuCreateWithoutProductInput)
            ),
          };
        }

        if (productTags?.length) {
          objCreate.productTags = {
            create: productTags.map((pt) => ({
              expiredAt: pt.expiredAt,
              productTagId: pt.productTagId,
            })),
          };
        }

        if (productOptions?.length) {
          objCreate.productToOptions = {
            create: productOptions.map(
              (op) =>
                ({
                  optionId: op.optionId,
                  displayOrder: op.displayOrder,
                  isRequired: op.isRequired,
                  maxSelect: op.maxSelect,
                  ProductToOptionToOptionItem: {
                    createMany: {
                      data: op.optionItems?.map(
                        (opI) =>
                          ({
                            optionItemId: opI.optionItemId,
                            displayOrder: opI.displayOrder,
                            priceModifierType: opI.priceModifierType,
                            priceModifierValue: opI.priceModifierValue,
                          } as Prisma.ProductToOptionToOptionItemCreateManyProductToOptionInput)
                      ),
                    },
                  },
                } as Prisma.ProductToOptionUncheckedCreateWithoutProductInput)
            ),
          };
        }

        const res = await prisma.product.create({
          data: objCreate,
        });

        return AppResponse.json({ status: 200, data: res });
      }
    )
  )
);

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
        const res = await prisma.product.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
