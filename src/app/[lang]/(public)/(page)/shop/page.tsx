import { TDictionaryKeys } from "@/app/[lang]/dictionaries"
import ShopPage from "@/components/sections/shopPage"

export default async function Page({
  searchParams,
  params,
}: PageProps<"/[lang]/shop">) {
  const { lang } = await params
  const resSearchParams = await searchParams
  console.log(resSearchParams)
  return <ShopPage queryCond={{}} lang={lang as TDictionaryKeys} />
}
