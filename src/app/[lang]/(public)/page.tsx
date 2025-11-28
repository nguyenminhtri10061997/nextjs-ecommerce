import BrandSlider from "@/components/customComponents/BrandSlider"
import Hero from "@/components/customComponents/Hero"
import PublicAppContainer from "@/components/customComponents/PublicAppContainer"
import HomeCategorySection from "@/components/sections/HomeCategorySection"
import HomeProductSection, {
  EType,
} from "@/components/sections/HomeProductSection"
import OurHappyCustomer from "@/components/sections/OurHappyCustomer"
import { Divider } from "@mui/material"
import { Suspense } from "react"
import "swiper/css/bundle"

export default function Page() {
  return (
    <div>
      <Hero />
      <BrandSlider />
      <PublicAppContainer>
        <main>
          <div>
            <div className="mt-[4.5625rem]">
              <Suspense>
                <HomeProductSection type={EType.NEW} />
              </Suspense>
            </div>
            <div className="my-[4rem]">
              <Divider />
            </div>
            <div className="mt-[4.5625rem]">
              <Suspense>
                <HomeProductSection type={EType.TOP_SELLING} />
              </Suspense>
            </div>
            <div className="mt-[5rem]">
              <HomeCategorySection />
            </div>
          </div>
        </main>
      </PublicAppContainer>

      <div className="mt-[5.0625rem]">
        <OurHappyCustomer />
      </div>
    </div>
  )
}
