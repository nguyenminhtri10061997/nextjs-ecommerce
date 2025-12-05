import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { aBeeZee, notoSans } from "@/constants/fonts"
import { getDictionary, TDictionaryKeys } from "../dictionaries"

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params
  const dict = await getDictionary(lang as TDictionaryKeys)
  const fontClass = lang === "en-US" ? aBeeZee.className : notoSans.className
  return (
    <div className={fontClass}>
      <Header lang={lang as TDictionaryKeys} dict={dict} />
      {children}
      <div className="mt-[10.625rem]">
        <Footer />
      </div>
    </div>
  )
}
