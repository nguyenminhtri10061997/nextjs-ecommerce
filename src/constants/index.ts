import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const defaultCookieOption: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
};