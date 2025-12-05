import ShopPage from "@/components/sections/shopPage"

export default async function Page({
  searchParams,
  params,
}: PageProps<"/[lang]/shop">) {
  const resSearchParams = await searchParams
  const resParams = await params
  console.log({resSearchParams, resParams})
  return <ShopPage queryCond={{}} />
}
