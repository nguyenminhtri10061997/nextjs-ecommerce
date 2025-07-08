import { AppEnvironment } from "@/environment/appEnvironment";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { lookup as mimeLookup } from "mime-types";

export default class AppS3Client {
  private static s3Client = new S3Client({});
  private static bucketName = AppEnvironment.BUCKET_NAME;

  static async s3CreateFile(file: File) {
    const originalName = file.name;
    const lastDotIndex = originalName.lastIndexOf(".");

    const hasExtension = lastDotIndex !== -1;
    const baseName = hasExtension
      ? originalName.slice(0, lastDotIndex)
      : originalName;
    const extension = hasExtension ? originalName.slice(lastDotIndex + 1) : "";

    const uuid = v4().slice(0, 8);
    const fileKey = `${baseName}-${uuid}${extension ? `.${extension}` : ""}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const contentType =
      file.type || mimeLookup(extension) || "application/octet-stream";
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType,
      })
    )
    return fileKey;
  }

  static async s3DeleteFile(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })
    );
    return true
  }
}
