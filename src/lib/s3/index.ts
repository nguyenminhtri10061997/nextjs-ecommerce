import { getBaseFileName, textToSlug } from "@/common";
import { AppEnvironment } from "@/environment/appEnvironment";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
  ObjectIdentifier,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { extension as mimeExtension } from "mime-types";
import { v4 } from "uuid";


export default class AppS3Client {
  private static s3Client = new S3Client();
  private static bucketName = AppEnvironment.S3_BUCKET_NAME;
  private static region = AppEnvironment.S3_REGION;

  private static getFileKey(file: File, isTemp = true) {
    const baseName = getBaseFileName(textToSlug(file.name));
    const contentType = file.type || "application/octet-stream";
    const extension = mimeExtension(contentType);
    const uuid = v4().slice(0, 8);

    const prefix = isTemp ? "temp" : "final";
    const fileKey = `${prefix}/${baseName}-${uuid}-${+new Date()}.${extension}`;
    return { fileKey, contentType };
  }

  static async s3CreateFile(file: File, isTemp = true) {
    const { fileKey, contentType } = this.getFileKey(file, isTemp);
    const buffer = Buffer.from(await file.arrayBuffer());
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType,
        Expires: new Date(),
      })
    );
    return fileKey;
  }

  static async s3CreateFiles(
    files: (File | undefined | null)[],
    isTemp = true
  ) {
    if (!files.length) {
      return [];
    }
    const putObjectCommands: PutObjectCommandInput[] = [];

    for (const file of files) {
      if (!file) {
        continue;
      }
      const { fileKey, contentType } = this.getFileKey(file, isTemp);

      const buffer = Buffer.from(await file.arrayBuffer());

      putObjectCommands.push({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType,
      });
    }

    const resUpload = await Promise.allSettled<string | null>(
      files.map((_, idx) => {
        const poCommand = putObjectCommands[idx];
        if (poCommand) {
          return new Promise(async (rs, rj) => {
            try {
              await this.s3Client.send(new PutObjectCommand(poCommand));
              rs(poCommand.Key!);
            } catch (err) {
              console.log("s3CreateFiles", err);
              rj(err);
            }
          });
        }
        return null;
      })
    );
    return resUpload;
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
