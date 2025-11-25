import { PropsWithChildren, Suspense } from "react"
import ClientLayout from "./clientLayout"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <ClientLayout>{children}</ClientLayout>
    </Suspense>
  )
}
