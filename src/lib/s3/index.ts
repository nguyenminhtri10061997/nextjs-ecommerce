import { getBaseFileName, textToSlug } from "@/common";
import { AppEnvironment } from "@/environment/appEnvironment";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { extension as mimeExtension } from "mime-types";
import { v4 } from "uuid";

export default class AppS3Client {
  private static s3Client = new S3Client({
    credentials: fromIni({
      profile: "admin-dev",
    }),
  });
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

  private static genFileKeyFromContentType(data: {
    fileName: string;
    contentType: string;
  }) {
    const baseName = getBaseFileName(data.fileName);
    const contentType = data.contentType || "application/octet-stream";
    const extension = mimeExtension(contentType);
    const uuid = v4().slice(0, 8);

    const prefix = "temp";
    const fileKey = `${prefix}/${baseName}-${uuid}-${+new Date()}.${extension}`;
    return fileKey;
  }

  static async s3PresignedUploadUrl(data: {
    fileName: string;
    contentType: string;
  }) {
    const Key = this.genFileKeyFromContentType(data);
    return createPresignedPost(this.s3Client, {
      Bucket: this.bucketName!,
      Key,
      Expires: 3 * 60,
      Fields: {
        "Content-Type": data.contentType,
      },
      Conditions: [
        [
          "content-length-range",
          0,
          AppEnvironment.MAX_FILE_SIZE_UPLOAD * 1024 * 1024,
        ], // <= MB
      ],
    });
  }

  static async moveS3File({
    Bucket,
    fromKey,
    toKey,
  }: {
    Bucket: string;
    fromKey: string;
    toKey?: string;
  }) {
    // Step 1: Copy
    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket,
        CopySource: `${Bucket}/${fromKey}`,
        Key: toKey,
      })
    );

    // Step 2: Delete original
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket,
        Key: fromKey,
      })
    );
    return true;
  }

  static async moveFromTempToFinalS3File(key: string) {
    const fileName = key.split("/")[1];
    const toKey = `final/${fileName}`;
    // Step 1: Copy
    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${key}`,
        Key: toKey,
      })
    );

    // Step 2: Delete original
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
    return toKey;
  }
}
