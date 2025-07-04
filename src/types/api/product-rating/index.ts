import { ProductRating } from "@prisma/client"
import { TPaginationResponse } from "../common"

export type TGetProductRatingListResponse = {
    data: ProductRating[]
    pagination: TPaginationResponse
}