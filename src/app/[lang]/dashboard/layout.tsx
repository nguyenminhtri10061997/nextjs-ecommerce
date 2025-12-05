import ClientDashboardLayoutLayout from "@/components/customComponents/ClientDashboardLayout"
import { roboto } from "@/constants/fonts"
import { ScopedCssBaseline } from "@mui/material"
import { getDictionary, TDictionaryKeys } from "../dictionaries"

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params
  const dict = await getDictionary(lang as TDictionaryKeys)

  return (
    <div className={roboto.className}>
      <ClientDashboardLayoutLayout lang={lang as TDictionaryKeys} dict={dict}>
        <ScopedCssBaseline>{children}</ScopedCssBaseline>
      </ClientDashboardLayoutLayout>
    </div>
  )
}
