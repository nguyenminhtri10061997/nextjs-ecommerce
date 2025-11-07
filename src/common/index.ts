import { AppEnvironment } from "@/constants/environment/appEnvironment";

export const getSegments = (pathname: string) => {
  return pathname.substring(6).split("/").filter(Boolean);
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

export function generateCombinations<T>(arrays: Array<T[]>) {
  return arrays.reduce<T[][]>(
    (acc, curr) => {
      const result: T[][] = [];
      for (const item of acc) {
        for (const val of curr) {
          result.push([...item, val]);
        }
      }
      return result;
    },
    [[]]
  );
}

export function slugifyFilename(filename: string) {
  const parts = filename.trim().split(".");
  if (parts.length < 2) return filename;

  const ext = parts.pop(); // lấy đuôi file
  const name = parts.join("."); // phần tên gốc nếu có nhiều dấu chấm

  const slug = name
    .normalize("NFD") // chuẩn hóa unicode
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu tiếng Việt
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // khoảng trắng → dấu gạch
    .replace(/[^\w\-]+/g, "") // xóa ký tự không hợp lệ
    .replace(/\-\-+/g, "-") // gộp nhiều dấu gạch thành 1
    .replace(/^-+/, "") // xóa dấu gạch ở đầu
    .replace(/-+$/, ""); // xóa dấu gạch ở cuối

  return `${slug}.${ext}`;
}

export function getS3ImgFullUrl(key?: string | null) {
  if (!key) {
    return key;
  }
  return `https://${AppEnvironment.S3_BUCKET_NAME}.s3.${AppEnvironment.S3_REGION}.amazonaws.com/${key}`;
}

export const calculateChecksumSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray));
  return base64;
};
