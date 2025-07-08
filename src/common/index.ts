import { TOrderQuery, TPaginationParams } from "@/types/api/common";

export const getSegments = (pathname: string) => {
  return pathname.substring(6).split("/").filter(Boolean);
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

export const getOrderBy = (orderQuery?: TOrderQuery) => {
  if (orderQuery?.orderKey && orderQuery?.orderType) {
    return {
      [orderQuery.orderKey]: orderQuery.orderType,
    };
  }
  return {};
};

export const textToSlug = (text: string): string => {
  return text
    .normalize("NFD") // tách dấu Unicode (vd: "ấ" => "a" + "̂" + "́")
    .replace(/[\u0300-\u036f]/g, "") // xoá các ký tự dấu
    .toLowerCase() // viết thường
    .trim() // xoá khoảng trắng đầu/cuối
    .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt, giữ lại chữ, số, khoảng trắng và dấu "-"
    .replace(/\s+/g, "-") // thay khoảng trắng bằng "-"
    .replace(/-+/g, "-"); // xoá dấu "-" lặp lại
};

export const getBaseFileName = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  const hasExtension = lastDotIndex !== -1;
  const baseName = hasExtension ? fileName.slice(0, lastDotIndex) : fileName;
  return baseName;
};