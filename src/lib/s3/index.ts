import { getBaseFileName } from "@/common";
import { AppEnvironment } from "@/environment/appEnvironment";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
  ObjectIdentifier,
} from "@aws-sdk/client-s3";
import { extension as mimeExtension } from "mime-types";
import { v4 } from "uuid";

export default class AppS3Client {
  private static s3Client = new S3Client({});
  private static bucketName = AppEnvironment.S3_BUCKET_NAME;
  private static region = AppEnvironment.S3_REGION;

  static async s3CreateFile(file: File) {
    const baseName = getBaseFileName(file.name);

    const contentType = file.type || "application/octet-stream";
    const extension = mimeExtension(contentType);

    const uuid = v4().slice(0, 8);
    const fileKey = `${baseName}-${uuid}-${+new Date()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType,
      })
    );
    return fileKey;
  }

  static getS3ImgFullUrl(key?: string | null) {
    if (!key) {
      return key;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  static async s3DeleteFile(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
    return true;
  }

  static async s3DeleteFiles(keys: string[]) {
    await this.s3Client.send(
      new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map(
            (k) =>
              ({
                Key: k,
              } as ObjectIdentifier)
          ),
        },
      })
    );
    return true;
  }
}
