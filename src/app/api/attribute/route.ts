import { AppResponse } from "@/common/server/appResponse";
import { AppError } from "@/common/server/appError";
import { getOrderBy } from "@/common";
import prisma from "@/lib/prisma";
import { THofContext } from "@/lib/HOF/type";
import { withValidateFieldHandler } from "@/lib/HOF/withValidateField";
import { withVerifyAccessToken } from "@/lib/HOF/withVerifyAccessToken";
import { withVerifyCanDoAction } from "@/lib/HOF/withVerifyCanDoAction";
import { EPermissionAction, EPermissionResource, Prisma } from "@prisma/client";
import { DeleteBodyDTO, GetQueryDTO, PostCreateBodyDTO } from "./validator";
import { ESearchType } from "@/lib/zod/paginationDTO";
import { AppStatusCode } from "@/common/statusCode";

export const GET = withValidateFieldHandler(
  null,
  GetQueryDTO,
  null,
  withVerifyAccessToken(
    withVerifyCanDoAction(
      {
        resource: EPermissionResource.ATTRIBUTE,
        action: EPermissionAction.READ,
      },
      async (_, ctx: THofContext<never, typeof GetQueryDTO>) => {
        const { orderQuery, searchQuery } = ctx.queryParse || {};
        const where: Prisma.AttributeWhereInput = {};

        if (searchQuery?.searchKey && searchQuery?.searchStr) {
          const key = searchQuery.searchKey as keyof Prisma.AttributeWhereInput;
          where[key] = {
            [searchQuery.searchType || ESearchType.contains]:
              searchQuery.searchStr,
          } as never;
        }

        const orderBy = getOrderBy(orderQuery);

        const data = await prisma.attribute.findMany({
          where,
          orderBy,
          include: {
            attributeValues: {
              orderBy:
                orderQuery?.orderKey === "displayOrder"
                  ? {
                      displayOrder: orderQuery?.orderType,
                    }
                  : {},
            },
          },
        });

        return AppResponse.json({ status: 200, data });
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
        resource: EPermissionResource.ATTRIBUTE,
        action: EPermissionAction.CREATE,
      },
      async (_, ctx: THofContext<never, never, typeof PostCreateBodyDTO>) => {
        const { name, slug, type, attributeValues } = ctx.bodyParse!;

        const exists = await prisma.attribute.findFirst({
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
        });
        if (exists) {
          if (exists.name === name) {
            return AppError.json({
              status: AppStatusCode.EXISTING,
              message: "Name already exist",
            });
          }
          if (exists.slug === slug) {
            return AppError.json({
              status: AppStatusCode.EXISTING,
              message: "Slug already exist",
            });
          }
        }

        const objCreate: Prisma.AttributeCreateInput = {
          name,
          slug,
          type,
        };

        if (attributeValues?.length) {
          objCreate.attributeValues = {
            createMany: {
              data: attributeValues.map((atv) => ({
                name: atv.name,
                slug: atv.slug,
                displayOrder: atv.displayOrder,
              })),
            },
          };
        }

        const created = await prisma.attribute.create({
          data: objCreate,
        });

        return AppResponse.json({ status: 200, data: created });
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
        resource: EPermissionResource.ATTRIBUTE,
        action: EPermissionAction.DELETE,
      },
      async (_, ctx: THofContext<never, never, typeof DeleteBodyDTO>) => {
        const res = await prisma.attribute.deleteMany({
          where: { id: { in: ctx.bodyParse!.ids } },
        });
        return AppResponse.json({ status: 200, data: res.count });
      }
    )
  )
);
