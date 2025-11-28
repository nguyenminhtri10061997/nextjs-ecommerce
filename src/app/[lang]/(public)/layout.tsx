import { getDictionary, TLang } from "@/app/[lang]/dictionaries"
import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { aBeeZee, notoSans } from "@/constants/fonts"

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params
  const dict = await getDictionary(lang as TLang)

  const fontClass = lang === "en-US" ? aBeeZee.className : notoSans.className

  return (
    <div className={fontClass}>
      <Header dict={dict} />
      <PublicAppContainer>{children}</PublicAppContainer>
      <div className="mt-[10.625rem]">
        <Footer />
      </div>
    </div>
  )
}
