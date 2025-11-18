import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import BannerCloseButton from "./BannerCloseButton"

type TProps = {
  dict: TReturnOfGetDictionary
}

export default function TopAdBanner({ dict }: TProps) {
  return (
    <div
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
            href="<?php echo esc_attr(wc_get_page_permalink('myaccount')); ?>"
            className="underline font-bold"
          >
            {dict.topAd.signUpNow}
          </a>
        </p>
        <BannerCloseButton />
      </div>
      <div />
    </div>
  )
}
