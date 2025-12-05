import { TAppLangProps } from "@/common/server"
import MainHeader from "./_components/mainHeader"
import TopAdBanner from "./_components/topAdBanner"

type HeaderProps = TAppLangProps

export default function Header({ dict, lang }: HeaderProps) {
  return (
    <header>
      <TopAdBanner dict={dict} />
      <MainHeader dict={dict} lang={lang} />
    </header>
  )
}
