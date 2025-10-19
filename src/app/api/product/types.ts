import { TPaginationResponse } from "@/types/api/common";
import { Product } from "@prisma/client";

export type TGetProductListResponse = {
  data: Product[];
  pagination: TPaginationResponse;
};
