import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import { Divider } from "@mui/material"

export default function Layout({ children }: LayoutProps<"/[lang]">) {
  return (
    <PublicAppContainer>
      <Divider />
      <div className="mt-6">{children}</div>
    </PublicAppContainer>
  )
}
