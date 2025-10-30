import { TPaginationParams, TOrderQuery } from "@/types/api/common";
import { useState } from "react";

type TProps<TKeyOrder> = {
    defaultOrder?: TOrderQuery<TKeyOrder>
}

export default function usePaginationAndSort<TKeyOrder = string>(props: TProps<TKeyOrder>) {
    const [pagination, setPagination] = useState<TPaginationParams>({
        currentPage: 0,
        pageSize: 10,
    })
    const [orderQuery, setOrderQuery] = useState<TOrderQuery<TKeyOrder>>(props.defaultOrder || {})
    return {
        pagination,
        orderQuery,
        setPagination,
        setOrderQuery,
    };
}