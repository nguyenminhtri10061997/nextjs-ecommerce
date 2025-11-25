import { getDictionary, TLang } from "@/app/[lang]/dictionaries"
import BrandSlider from "@/components/customComponents/BrandSlider"
import Hero from "@/components/customComponents/Hero"
import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import Header from "@/components/layout/header"
import { aBeeZee, notoSans } from "@/constants/fonts"

export default async function Layout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params
  const dict = await getDictionary(lang as TLang)

  const fontClass = lang === "en-US" ? aBeeZee.className : notoSans.className

  return (
    <div className={fontClass}>
      <Header dict={dict} />
      <Hero />

      <BrandSlider />
      <PublicAppContainer>
        <main className="bg-yello-500">{props.children}</main>
      </PublicAppContainer>
    </div>
  )
}
