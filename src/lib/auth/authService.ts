import { PostAccountLoginBodyDTO } from '@/app/api/auth/login/validator';
import prisma from '@/lib/prisma';
import { EUserOrAccountType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';
import { output } from 'zod/v4';

export class AuthService {
  private static readonly saltRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static getClientInfo(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for') || "";
    const userAgent = req.headers.get('user-agent') || "unknown"
    return {
      ipAddress: forwarded.split(',')[0],
      userAgent,
    }
  };

  static checkAccount = async (
    data: output<typeof PostAccountLoginBodyDTO>,
    type: EUserOrAccountType = EUserOrAccountType.STAFF
  ) => {
    const account = await prisma.account.findUnique({
      where: {
        username: data.username,
        isBanned: false,
        isBlocked: false,
        type,
      },
    });

    if (!account) {
      return null
    }

    const isValid = await AuthService.comparePassword(
      data.password,
      account.password
    );

    if (!isValid) {
      return null
    }

    return account
  }
}
