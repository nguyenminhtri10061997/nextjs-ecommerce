import { TOrderQuery, TPaginationParams } from "@/types/api/common";

export const getOrderBy = (orderQuery?: TOrderQuery) => {
  if (orderQuery?.orderKey && orderQuery?.orderType) {
    return {
      [orderQuery.orderKey]: orderQuery.orderType,
    };
  }
  return {};
};

export const getSkipAndTake = (pagination?: TPaginationParams) => {
  if (pagination) {
    return {
      skip: pagination?.currentPage * pagination?.pageSize,
      take: pagination?.pageSize,
    };
  }
  return {};
};

export const getBaseFileName = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  const hasExtension = lastDotIndex !== -1;
  const baseName = hasExtension ? fileName.slice(0, lastDotIndex) : fileName;
  return baseName;
};
