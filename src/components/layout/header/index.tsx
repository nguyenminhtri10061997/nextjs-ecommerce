import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import MainHeader from "./_components/mainHeader"
import TopAdBanner from "./_components/topAdBanner"

type HeaderProps = {
  dict: TReturnOfGetDictionary
}

export default function Header({ dict }: HeaderProps) {
  return (
    <header>
      <TopAdBanner dict={dict} />
      <MainHeader />
    </header>
  )
}
