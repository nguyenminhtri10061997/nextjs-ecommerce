import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import BannerCloseButton from "./bannerCloseButton"
import PublicAppContainer from "@/components/customComponents/PublicAppContainer"

type TProps = {
  dict: TReturnOfGetDictionary
}

export default function TopAdBanner({ dict }: TProps) {
  return (
    <PublicAppContainer
      id="top-ad-banner"
      className="bg-black app-container"
      role="banner"
      aria-label="Promotional banner"
    >
      <div />
      <div className="relative py-[9px]">
        <p className="text-center text-white text-[12px] md:text-[14px]">
          {dict.topAd.text}.{" "}
          <a
            href="#"
            className="underline font-bold"
          >
            {dict.topAd.signUpNow}
          </a>
        </p>
        <BannerCloseButton />
      </div>
      <div />
    </PublicAppContainer>
  )
}
