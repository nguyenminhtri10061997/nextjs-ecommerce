import Link, { LinkProps } from "next/link"
import LinkLoadingIndicator from "../LinkLoadingIndicator"

type TProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode
  }

const AppLinkWithLoading = ({ children, ...props }: TProps) => {
  return (
    <Link {...props}>
      <LinkLoadingIndicator />
      {children}
    </Link>
  )
}

export default AppLinkWithLoading
