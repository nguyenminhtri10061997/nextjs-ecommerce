"use client"
import {
  TDictionaryKeys,
  TReturnOfGetDictionary,
} from "@/app/[lang]/dictionaries"
import AlertProvider from "@/components/providers/AlertProvider"
import DashboardProvider from "@/components/providers/dashBoardProvider"
import LangProvider from "@/components/providers/LangProvider"
import LoadingProvider from "@/components/providers/loadingProvider"

type TProps = {
  children: React.ReactNode
  lang: TDictionaryKeys
  dict: TReturnOfGetDictionary
}

export default function ClientDashboardLayoutLayout({
  children,
  lang,
  dict,
}: TProps) {
  return (
    <LangProvider lang={lang} dict={dict}>
      <LoadingProvider>
        <AlertProvider>
          <DashboardProvider dict={dict}>{children}</DashboardProvider>
        </AlertProvider>
      </LoadingProvider>
    </LangProvider>
  )
}
