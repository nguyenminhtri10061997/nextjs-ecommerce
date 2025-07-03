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
                    productStatuses,
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
                            displayOrder: at.displayOrder,
                            attributeValues: {
                                create: at.attributeValues.map(atv => ({
                                    name: atv.name,
                                    displayOrder: atv.displayOrder,
                                    image: atv.image,
                                })),
                            }
                        })),
                    }
                }


                if (skus?.length) {
                    objCreate.skus = {
                        create: [
                            {
                                
                            }
                        ]
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
