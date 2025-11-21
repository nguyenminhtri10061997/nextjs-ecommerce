import { z } from "zod/v4";

export const PagingQueryDTO = z.object({
  pagination: z.object({
    currentPage: z.coerce.number().min(0),
    pageSize: z.coerce.number().min(1).max(200),
  }),
});

export const OrderQueryDTO = (IEnum: string[]) =>
  z.object({
    orderQuery: z.object({
      orderKey: z.enum(IEnum),
      orderType: z.enum(["asc", "desc"]),
    }),
  });

export const DateRangeQueryDTO = z.object({
  dateRangeQuery: z
    .object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "endDate must be greater than startDate",
      path: ["endDate"],
    }),
});

export enum ESearchType {
  contains = "contains",
  startsWith = "startsWith",
  endsWith = "endsWith",
  equals = "equals",
}

export const SearchQueryDTO = <T extends Readonly<string>>(IEnum: T[]) =>
  z.object({
    searchQuery: z.object({
      searchKey: z.enum(IEnum),
      searchStr: z.string(),
      searchType: z.enum(ESearchType).default(ESearchType.equals).optional(),
    }),
  });

export const LanguageQueryDTO = z.object({
  language: z.string(),
});
