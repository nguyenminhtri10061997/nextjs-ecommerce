import { getBaseFileName, textToSlug } from "@/common"
import { AppEnvironment } from "@/constants/environment/appEnvironment"
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { fromIni } from "@aws-sdk/credential-provider-ini"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { extension as mimeExtension } from "mime-types"
import { v4 } from "uuid"
import { retryWithLog } from "../retry"

export default class AppS3Client {
  private static s3Client = new S3Client({
    credentials: fromIni({ profile: "admin-dev" }),
    region: AppEnvironment.S3_REGION,
  })

  private static bucketName = AppEnvironment.S3_BUCKET_NAME

  private static getFileKey(file: File, isTemp = true) {
    const baseName = getBaseFileName(textToSlug(file.name))
    const contentType = file.type || "application/octet-stream"
    const extension = mimeExtension(contentType)
    const uuid = v4().slice(0, 8)
    const prefix = isTemp ? "temp" : "final"
    const fileKey = `${prefix}/${baseName}-${uuid}-${+new Date()}.${extension}`
    return { fileKey, contentType }
  }

  private static genFileKeyFromContentType(data: {
    fileName: string
    contentType: string
  }) {
    const baseName = getBaseFileName(data.fileName)
    const contentType = data.contentType || "application/octet-stream"
    const extension = mimeExtension(contentType)
    const uuid = v4().slice(0, 8)
    const prefix = "temp"
    const fileKey = `${prefix}/${baseName}-${uuid}-${+new Date()}.${extension}`
    return fileKey
  }

  // =======================
  // Public S3 methods
  // =======================

  static async s3CreateFile(file: File, isTemp = true) {
    const { fileKey, contentType } = this.getFileKey(file, isTemp)
    const buffer = Buffer.from(await file.arrayBuffer())

    const args = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    }
    await retryWithLog(
      async () => {
        await this.s3Client.send(new PutObjectCommand(args))
      },
      {
        args,
        funcName: "s3CreateFile",
      }
    )
    return fileKey
  }

  static async s3CreateFiles(
    files: (File | null | undefined)[],
    isTemp = true
  ) {
    if (!files.length) return []

    const results = await Promise.allSettled(
      files.map(async (file) => {
        if (!file) return null
        const fileKey = await this.s3CreateFile(file, isTemp)
        return fileKey
      })
    )

    return results
  }

  static async s3DeleteFile(key: string, funcName?: string) {
    const args = {
      Bucket: this.bucketName,
      Key: key,
    }
    await retryWithLog(
      async () => {
        await this.s3Client.send(new DeleteObjectCommand(args))
      },
      {
        args,
        funcName,
      }
    )
    return true
  }

  static async s3DeleteFiles(keys: string[], funcName?: string) {
    const objs = keys.map((k) => ({ Key: k }) as ObjectIdentifier)
    if (!objs.length) return true

    const args = {
      Bucket: this.bucketName,
      Delete: { Objects: objs },
    }
    await retryWithLog(
      async () => {
        await this.s3Client.send(new DeleteObjectsCommand(args))
      },
      {
        args,
        funcName,
      }
    )

    return true
  }

  static async createPresignedPost(data: {
    fileName: string
    contentType: string
  }) {
    const Key = this.genFileKeyFromContentType(data)
    return createPresignedPost(this.s3Client, {
      Bucket: this.bucketName!,
      Key,
      Expires: 3 * 60,
      Fields: { "Content-Type": data.contentType },
      Conditions: [
        [
          "content-length-range",
          0,
          AppEnvironment.MAX_FILE_SIZE_UPLOAD * 1024 * 1024,
        ],
      ],
    })
  }

  static async getSignedUrl(data: {
    fileName: string
    contentType: string
    checksumSHA256?: string
  }) {
    const key = this.genFileKeyFromContentType(data)
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: data.contentType,
      ChecksumSHA256: data.checksumSHA256,
    })
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 5 * 60,
      unhoistableHeaders: new Set(["x-amz-checksum-sha256"]),
    })
    return { signedUrl, key }
  }

  static async copyS3File({
    fromKey,
    toKey,
    isDeleteOld = false,
  }: {
    fromKey: string
    toKey?: string
    isDeleteOld?: boolean
  }) {
    const Bucket = this.bucketName
    const argsCopy = {
      Bucket,
      CopySource: `${Bucket}/${fromKey}`,
      Key: toKey,
    }
    await retryWithLog(
      async () => {
        await this.s3Client.send(new CopyObjectCommand(argsCopy))
      },
      {
        args: argsCopy,
      }
    )

    if (isDeleteOld) {
      this.s3DeleteFile(fromKey)
    }

    return true
  }

  static async copyFromTempToFinalS3File(
    key?: string | null,
    isDeleteOld = false
  ) {
    if (!key) return null
    const fileName = key.split("/")[1]
    const toKey = `final/${fileName}`

    // Step 1: Copy
    this.copyS3File({
      fromKey: key,
      isDeleteOld,
      toKey,
    })
    return toKey
  }
}
