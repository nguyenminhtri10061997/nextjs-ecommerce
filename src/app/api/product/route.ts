import { getOrderBy, getSkipAndTake } from "@/common";
import { AppError } from "@/common/appError";
import { AppResponse } from "@/common/appResponse";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import prisma from "@/lib/prisma";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import {
    DeleteBodyDTO,
    GetQueryDTO,
    PostCreateBodyDTO,
} from "./validator";
import dayjs from "dayjs";
import { TGetProductListResponse } from "@/types/api/product";

export const GET = withValidateFieldHandler(
    null,
    GetQueryDTO,
    null,
    withVerifyAccessToken(
        withVerifyCanDoAction(
            { resource: EPermissionResource.PRODUCT, action: EPermissionAction.READ },
            async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
                const { orderQuery, searchQuery, pagination, dateRangeQuery } = ctx.queryParse || {};
                const where: Prisma.ProductWhereInput = {};

                if (searchQuery?.searchKey && searchQuery?.searchStr) {
                    const key = searchQuery.searchKey as keyof Prisma.ProductWhereInput;
                    where[key] = {
                        [searchQuery.searchType || ESearchType.equals]: searchQuery.searchStr,
                    } as any;
                }

                if (dateRangeQuery?.startDate && dateRangeQuery?.endDate) {
                    where["createdAt"] = {
                        gte: dayjs(dateRangeQuery.startDate).startOf("d").toDate(),
                        lte: dayjs(dateRangeQuery.endDate).startOf("d").toDate(),
                    };
                }

                const {
                    skip,
                    take,
                } = getSkipAndTake(pagination)

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
                        pagination: pagination ? {
                            ...pagination,
                            count,
                        } : undefined,
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
            { resource: EPermissionResource.PRODUCT, action: EPermissionAction.CREATE },
            async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
                const {
                    name,
                    slug,
                    attributes,
                    skus,
                    translations,
                    productStatusIds,
                    productOptions,
                    ...omit
                } = ctx.bodyParse!;

                const exists = await prisma.product.findFirst({
                    where: {
                        OR: [
                            {
                                name,
                            },
                            {
                                slug,
                            },
                        ]
                    }
                });
                if (exists) {
                    return AppError.json({ status: 409, message: `${exists.name === name ? "name" : "slug"} already exists` });
                }

                const objCreate: Prisma.ProductCreateInput = {
                    name,
                    slug,
                    ...omit,
                }

                if (attributes?.length) {
                    objCreate.attributes = {
                        create: attributes.map(at => ({
                            name: at.name,
                            slug: at.slug,
                            image: at.image,
                            displayOrder: at.displayOrder,

                            attributeValues: {
                                create: at.attributeValues.map(atv => ({
                                    image: atv.image,
                                    slug: atv.slug,
                                    name: atv.name,
                                    displayOrder: atv.displayOrder,
                                } as Prisma.ProductAttributeValueCreateInput)),
                            }
                        })),
                    }
                }

                if (skus?.length) {
                    objCreate.skus = {
                        create: skus.map(sku => ({
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
                            isActive: sku.isActive,
                            isDefault: sku.isDefault,
                            displayOrder: sku.displayOrder,
                            skuAttributeValues: {
                                create: sku.skuAttributeValues
                            },
                        }) as Prisma.ProductSkuCreateWithoutProductInput)
                    }
                }

                if (translations?.length) {
                    objCreate.translations = {
                        create: translations
                    }
                }

                if (productStatusIds?.length) {
                    objCreate.productStatuses = {
                        connect: productStatusIds.map(id => ({
                            id,
                        }))
                    }
                }

                if (productOptions?.length) {
                    objCreate.productOptions = {
                        create: productOptions.map(op => ({
                            productOptionId: op.productOptionId,
                            displayOrder: op.displayOrder,
                            isRequired: op.isRequired,
                            maxSelect: op.maxSelect,
                            priceModifierType: op.priceModifierType,
                            priceModifierValue: op.priceModifierValue,
                        }) as Prisma.ProductToProductOptionUncheckedCreateWithoutProductInput)
                    }
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
            { resource: EPermissionResource.PRODUCT, action: EPermissionAction.DELETE },
            async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
                const res = await prisma.product.deleteMany({
                    where: { id: { in: ctx.bodyParse!.ids } },
                });
                return AppResponse.json({ status: 200, data: res.count });
            }
        )
    )
);
