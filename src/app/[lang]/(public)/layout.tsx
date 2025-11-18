import { TAppPageProps } from "@/common/client"
import Header from "@/components/layout/header"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { aBeeZee, notoSans } from "@/constants/fonts"
import "reflect-metadata"

type TProps = TAppPageProps

export default async function Layout(props: TProps) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  const fontClass = lang === "en-US" ? aBeeZee.className : notoSans.className

  return (
    <div className={fontClass}>
      <Header dict={dict} />
      <div className="grid grid-cols-[var(--content-grid)]">
        <div className="bg-red-500"></div>
        <main className="bg-yello-500">{props.children}</main>
        <div className="bg-red-500"></div>
      </div>
    </div>
  )
}
