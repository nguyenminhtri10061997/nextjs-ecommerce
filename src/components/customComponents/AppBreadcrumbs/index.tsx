import { TAppLangProps } from "@/common/server"
import Link from "next/link"
import { Fragment } from "react/jsx-runtime"

type TProps = Pick<TAppLangProps, "lang"> & {
  segments: {
    title: string
    href: string
  }[]
}

export default function AppBreadcrumbs({ segments, lang }: TProps) {
  const segmentsLen = segments.length
  const homeHref = `/${lang}`
  let href = homeHref
  const breadcrumbs = segments.map((segment, idx) => {
    href = `${href}/${segment.href}`

    const label = segment.title

    const isLast = idx === segmentsLen - 1
    return (
      <Fragment key={href}>
        <span className="mx-2">{">"}</span>
        <Link
          href={href}
          className={`hover:text-black transition-colors ${isLast ? "font-medium text-black" : ""}`}
        >
          {label}
        </Link>
      </Fragment>
    )
  })
  return (
    <nav className="col-start-2 flex items-center text-sm text-gray-500">
      <Link href={homeHref} className="hover:text-black transition-colors">
        Home
      </Link>
      {breadcrumbs}
    </nav>
  )
}
