import { AppEnvironment } from "@/constants/appEnvironment";
import { Account } from "@prisma/client";
import dayjs from "dayjs";
import jwt, { VerifyOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

type TDataRefreshToken = {
  accountId: string;
};

type TDataToken = {
  accountId: string;
  tokenVersion: number;
  sessionId: string;
};

export class JwtService {
  private static readonly jwtSecret = AppEnvironment.JWT_SECRET;
  static readonly jwtAccessExpiresValue = 1;
  static readonly jwtAccessExpiresUnit = "h";
  private static readonly jwtExpiresIn: StringValue = `${this.jwtAccessExpiresValue}${this.jwtAccessExpiresUnit}`;
  static readonly jwtRefreshExpiresValue = 7;
  static readonly jwtRefreshExpiresUnit = "d";
  private static readonly jwtRefreshExpiresIn: StringValue = `${this.jwtRefreshExpiresValue}${this.jwtRefreshExpiresUnit}`;

  static async generateAccessToken(payload: TDataToken) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  static async generateRefreshToken(payload: TDataRefreshToken) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
    });
  }

  static verifyToken(token: string, options?: VerifyOptions) {
    return jwt.verify(token, this.jwtSecret, options) as TDataToken;
  }

  static verifyRefreshToken(token: string, options?: VerifyOptions) {
    return jwt.verify(token, this.jwtSecret, options) as TDataRefreshToken;
  }

  static generateRefreshTokenAndExpires = async (account: Account) => {
    const refreshTokenExpiresAt = dayjs()
      .add(JwtService.jwtRefreshExpiresValue, JwtService.jwtRefreshExpiresUnit)
      .toDate();

    const refreshToken = await JwtService.generateRefreshToken({
      accountId: account.id,
    });

    return {
      refreshTokenExpiresAt,
      refreshToken,
    };
  };

  static generateAccessTokenAndExpired = async (
    account: Account,
    sessionId: string
  ) => {
    const accessTokenExpiresAt = dayjs()
      .add(JwtService.jwtAccessExpiresValue, JwtService.jwtAccessExpiresUnit)
      .toDate();

    const accessToken = await JwtService.generateAccessToken({
      accountId: account.id,
      tokenVersion: account.accessTokenVersion,
      sessionId,
    });

    return {
      accessToken,
      accessTokenExpiresAt,
    };
  };
}
