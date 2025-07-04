import { z } from "zod/v4";
import { DateRangeQueryDTO, OrderQueryDTO, PagingQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { EPriceModifierType, EStockType, Product } from "@prisma/client";

const TranslationDTO = z.object({
    languageId: z.uuid(),
    name: z.string(),
    slug: z.string(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    seoDescription: z.string().optional(),
    detail: z.string().optional(),
});


const ProductAttributeValueDTO = z.object({
    name: z.string(),
    slug: z.string(),
    image: z.string().optional(),
    displayOrder: z.number().nonnegative(),
});

const ProductAttributeDTO = z.object({
    name: z.string(),
    slug: z.string(),
    image: z.string().optional(),
    displayOrder: z.number().nonnegative(),
    attributeValues: z.array(ProductAttributeValueDTO),
});

const ProductSkuAttributeValue = z.object({
    productAttributeId: z.string(),
    productAttributeValueId: z.string(),
    image: z.string().optional(),
    Label: z.string().optional(),
})

const ProductSkuDTO = z.object({
    sellerSku: z.string(),
    stockStatus: z.enum(EStockType).optional(),
    stockType: z.enum(EStockType),
    salePrice: z.number().min(0).optional(),
    price: z.number().min(0),
    costPrice: z.number().min(0).optional(),
    stock: z.number().optional(),
    barcode: z.string().optional(),
    weight: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    length: z.number().optional(),
    note: z.string().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    displayOrder: z.number().nonnegative(),
    skuAttributeValues: ProductSkuAttributeValue,
}).check(ctx => {
    if (ctx.value.stockType === "EXTERNAL") {
        ctx.issues.push({
            code: 'custom',
            input: ctx.value.stockStatus,
            path: ['stockStatus'],
            message: "stockStatus is required if stockType is EXTERNAL",
        })
    }
});

const ProductOptionDTO = z.object({
    productOptionId: z.uuid(),
    displayOrder: z.number().nonnegative().optional(),
    isRequired: z.boolean().optional(),
    maxSelect: z.number().nonnegative().optional(),
    priceModifierType: z.enum(EPriceModifierType),
    priceModifierValue: z.number()
});

// API

export const GetQueryDTO = z.object({
    pagination: PagingQueryDTO.shape.pagination.optional(),
    orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
    searchQuery: SearchQueryDTO(["name"] as (keyof Product)[]).shape.searchQuery.optional(),
    dateRangeQuery: DateRangeQueryDTO.shape.dateRangeQuery.optional(),
});

export const PostCreateBodyDTO = z.object({
    productCategoryId: z.uuid().optional().nullable(),
    brandId: z.uuid().optional(),
    name: z.string().min(1),
    slug: z.string().min(1),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    seoDescription: z.string().optional(),
    detail: z.string().optional(),
    mainImage: z.string().optional(),
    listImages: z.array(z.string()).optional(),
    isActive: z.boolean(),
    viewCount: z.number().nonnegative().optional(),
    soldCount: z.number().nonnegative().optional(),

    attributes: z.array(ProductAttributeDTO).optional(),
    skus: z.array(ProductSkuDTO).optional(),
    translations: z.array(TranslationDTO).optional(),
    productStatusIds: z.array(z.uuid()).optional(),
    productOptions: z.array(ProductOptionDTO).optional().default([]),
});

export const DeleteBodyDTO = z.object({
    ids: z.array(z.uuid()),
});