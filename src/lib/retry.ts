import retry from "async-retry"
import { v4 } from "uuid"
import prisma from "./prisma"

interface RetryWithLogOptions<
  TArgs = unknown,
  TMetadata = Record<string, unknown>,
> {
  retries?: number
  minTimeout?: number
  factor?: number
  retryKey?: string
  funcName?: string
  args?: TArgs
  metadata?: TMetadata
  logEachRetry?: boolean
  onFinalFail?: (
    error: unknown,
    context: {
      retryKey?: string
      funcName?: string
      args?: TArgs
      metadata?: TMetadata
      attempts: number
    }
  ) => Promise<void> | void
}

export async function retryWithLog<
  T,
  TArgs = unknown,
  TMetadata = Record<string, unknown>,
>(
  fn: () => Promise<T>,
  options: RetryWithLogOptions<TArgs, TMetadata> = {}
): Promise<T> {
  const {
    retries = 3,
    minTimeout = 1000,
    factor = 2,
    retryKey = v4(),
    funcName,
    args,
    metadata,
    logEachRetry = true,
    onFinalFail,
  } = options

  try {
    return await retry(
      async (bail, attempt) => {
        if (logEachRetry) console.log(`🔁 [${retryKey}] Attempt ${attempt}`)

        try {
          return await fn()
        } catch (err: unknown) {
          if (
            err instanceof Error &&
            "status" in err &&
            typeof err.status === "number" &&
            err.status < 500
          ) {
            bail(err)
          }

          console.warn(
            `⚠️ [${retryKey}] Attempt ${attempt} failed: ${err instanceof Error ? err.message : String(err)}`
          )
          throw err
        }
      },
      { retries, minTimeout, factor }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined

    try {
      await prisma.retryError.create({
        data: {
          retryKey,
          funcName,
          args: args ?? undefined,
          message,
          stack,
          metadata: metadata ?? undefined,
        },
      })
    } catch (dbErr: unknown) {
      console.error(
        `💥 [${retryKey}] Failed to log RetryError: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`
      )
    }

    if (onFinalFail) {
      try {
        await onFinalFail(err, {
          retryKey,
          funcName,
          args,
          metadata,
          attempts: retries,
        })
      } catch (callbackErr: unknown) {
        console.error(
          `⚠️ [${retryKey}] onFinalFail threw error: ${callbackErr instanceof Error ? callbackErr.message : String(callbackErr)}`
        )
      }
    }

    throw err
  }
}
