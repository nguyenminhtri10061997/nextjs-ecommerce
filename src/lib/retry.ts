import { v4 as uuidv4 } from "uuid";
import prisma from "./prisma";

type RetryOptions<TArgs> = {
  maxRetries?: number;
  delayMs?: number;
  args?: TArgs;
  funcName?: string;
  onFinalFail?: (error: unknown, args?: TArgs) => Promise<void> | void;
};

export async function retry<T, TArgs = unknown>(
  callback: () => Promise<T>,
  options: RetryOptions<TArgs> = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 500,
    args,
    funcName,
    onFinalFail,
  } = options;

  const retryKey = uuidv4();
  let attempt = 0;

  while (true) {
    try {
      return await callback();
    } catch (error) {
      attempt++;

      const isLastAttempt = attempt > maxRetries;
      if (isLastAttempt) {
        await saveRetryErrorLog({
          retryKey,
          funcName,
          error,
          args,
          attempts: attempt,
          delayMs,
          isFinalFail: false,
        });

        if (onFinalFail) {
          try {
            await onFinalFail(error, args);
          } catch (finalError) {
            await saveRetryErrorLog({
              retryKey,
              funcName: `onFinalFail:${funcName || "anonymous"}`,
              error: finalError,
              args,
              attempts: attempt,
              delayMs,
              isFinalFail: true,
            });
          }
        }

        throw error;
      }

      console.warn(
        `Retry ${attempt} failed. Retrying in ${delayMs}ms...`,
        error
      );

      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

async function saveRetryErrorLog(data: {
  retryKey: string;
  funcName?: string;
  error: unknown;
  args?: unknown;
  attempts: number;
  delayMs?: number;
  isFinalFail?: boolean;
}) {
  const { retryKey, funcName, error, args, attempts, delayMs, isFinalFail } =
    data;

  const errObj = error instanceof Error ? error : new Error(String(error));

  await prisma.retryError.create({
    data: {
      retryKey,
      funcName,
      args: args as object,
      stack: errObj.stack,
      metadata: {
        error: String(errObj),
        attempts,
        delayMs,
        isFinalFail,
      },
    },
  });
}
