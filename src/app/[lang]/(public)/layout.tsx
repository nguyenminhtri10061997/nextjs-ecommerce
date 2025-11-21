import { getDictionary } from "@/app/[lang]/dictionaries"
import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import Header from "@/components/layout/header"
import { aBeeZee, notoSans } from "@/constants/fonts"
import "reflect-metadata"
import { LayoutProps } from "../../../../.next/types/app/[lang]/layout"
import Hero from "@/components/customComponents/Hero"

export default async function Layout(props: LayoutProps) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  const fontClass = lang === "en-US" ? aBeeZee.className : notoSans.className

  return (
    <div className={fontClass}>
      <Header dict={dict} />
      <Hero />
      <PublicAppContainer>
        <main className="bg-yello-500">{props.children}</main>
      </PublicAppContainer>
    </div>
  )
}
