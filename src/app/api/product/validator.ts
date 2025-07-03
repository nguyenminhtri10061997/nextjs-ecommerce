import { z } from "zod/v4";
import { DateRangeQueryDTO, OrderQueryDTO, PagingQueryDTO, SearchQueryDTO } from "@/lib/zod/paginationDTO";
import { EPriceModifierType, Product } from "@prisma/client";

const TranslationDTO = z.object({
    languageId: z.uuid(),
    name: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    seoDescription: z.string().optional(),
});

const ProductAttributeValueDTO = z.object({
    name: z.string(),
    image: z.string().optional(),
    displayOrder: z.int(),
});

const ProductAttributeDTO = z.object({
    name: z.string(),
    displayOrder: z.int(),
    attributeValues: z.array(ProductAttributeValueDTO),
});

const ProductSkuDTO = z.object({
    sellerSku: z.string(),
    skuCode: z.string(),
    barcode: z.string(),
    price: z.number(),
    
    stock: z.number(),
    images: z.array(z.string()).optional(),
    attributeValueIds: z.array(z.uuid()),
});

const ProductStatusDTO = z.object({
    productStatusId: z.uuid(),
});

const ProductOptionDTO = z.object({
    productOptionId: z.uuid(),
    displayOrder: z.int().optional(),
    isRequired: z.boolean().optional(),
    maxSelect: z.int().optional(),
    priceModifierType: z.enum(EPriceModifierType),
    priceModifierValue: z.number()
});

// API

export const GetQueryDTO = z.object({
    pagination: PagingQueryDTO.shape.pagination.optional(),
    orderQuery: OrderQueryDTO.shape.orderQuery.optional(),
    searchQuery: SearchQueryDTO(["name", "slug"] as (keyof Product)[]).shape.searchQuery.optional(),
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
    viewCount: z.int().optional(),
    soldCount: z.int().optional(),
    avgRate: z.int().optional(),

    attributes: z.array(ProductAttributeDTO).optional(),
    skus: z.array(ProductSkuDTO).optional(),
    translations: z.array(TranslationDTO).optional(),
    productStatuses: z.array(ProductStatusDTO).optional(),
    productOptions: z.array(ProductOptionDTO).optional().default([]),
});

export const DeleteBodyDTO = z.object({
    ids: z.array(z.uuid()),
});