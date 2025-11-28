import fileLocale from "@/constants/locale/locales.json"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { NextRequest, NextResponse } from "next/server"

const { defaultLocale = "en-US", locales = [] } = fileLocale
const protectedRoutes = ["/dashboard"]
const loginPath = "/dashboard/login"

const getLocale = (headers: Headers) => {
  const headersObject: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersObject[key] = value
  })

  const languages = new Negotiator({ headers: headersObject }).languages()

  return match(languages, locales, defaultLocale)
}

export default async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const { pathname } = req.nextUrl

  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!hasLocalePrefix) {
    const locale = getLocale(req.headers)
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  const accessToken = req.cookies.get("accessToken")?.value || ""

  const isProtected = protectedRoutes.some(
    (i) => pathname === i || pathname.startsWith(i)
  )

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL(loginPath, url))
  }

  if (pathname === loginPath && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", url))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
