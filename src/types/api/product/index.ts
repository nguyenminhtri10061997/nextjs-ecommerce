import { Product } from "@prisma/client";
import { TPaginationResponse } from "../common";

export type TGetProductListResponse = {
    data: Product[],
    pagination: TPaginationResponse
}