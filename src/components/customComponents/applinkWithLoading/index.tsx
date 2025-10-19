import LinkLoadingIndicator from "@/components/LinkLoadingIndicator";
import Link, { LinkProps } from "next/link";

type TProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

const AppLinkWithLoading = ({ children, ...props }: TProps) => {
  return (
    <Link {...props}>
      <LinkLoadingIndicator />
      {children}
    </Link>
  );
};

export default AppLinkWithLoading;
