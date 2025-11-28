import { Divider } from "@mui/material"

export default function Layout({
  children,
}: LayoutProps<"/[lang]/product/[slug]">) {
  return (
    <div>
      <Divider />
      {children}
    </div>
  )
}
