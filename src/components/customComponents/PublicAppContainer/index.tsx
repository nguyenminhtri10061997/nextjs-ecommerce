import { DetailedHTMLProps, HTMLAttributes } from "react"

type TProps = React.PropsWithChildren & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export default function PublicAppContainer({ children, className, ...rest }: TProps) {
  return (
    <div className={`app-container ${className}`} {...rest}>
      <div></div>
      <div>{children}</div>
      <div></div>
    </div>
  )
}
