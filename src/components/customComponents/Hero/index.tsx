import heroImg from "@public/images/hero.png"
import Image from "next/image"
import { useId } from "react"
import PublicAppContainer from "../PublicAppContainer"
import Counter from "./_components/counter"

export default function Hero() {
  const id1 = useId()
  const id2 = useId()
  const id3 = useId()

  return (
    <div className="bg-[#F2F0F1] relative pt-[40px] md:pt-0">
      <div className="md:absolute top-[103px] w-full z-1">
        <PublicAppContainer>
          <div id="text-box" className="left-[100px] m-auto">
            <div className="italic text-[36px] md:text-[45px] lg:text-[64px] w-[315px] md:w-[400px] lg:w-[577px] leading-[34px] md:leading-[64px]">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </div>
            <p className="text-black/60 text-[14px] md:text-[16px] leading-[16px] w-[358px] lg:w-[545px] mt-[20px] md:leading-[22px] md:mt-[32px]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <a
              href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))) ?>"
              className="bg-black text-white rounded-full p-[15px] text-center cursor-pointer mt-[24px] w-[358px] md:mt-[10px] md:w-[210px] no-underline! inline-block"
            >
              Shop Now
            </a>
            <div className="flex mt-[48px] gap-y-[12px] flex-wrap justify-center sm:justify-around md:justify-start gap-[32px]">
              <Counter value={200} id={id1}>
                <div
                  id={id1}
                  className="italic [word-spacing:-10px] text-[24px] md:text-[40px] w-full"
                >
                  200 +
                </div>
                <div className="text-black/60 text-[12px] md:text-[16px]">
                  International Brands
                </div>
              </Counter>
              <div className="w-[1px] bg-black/10"></div>
              <Counter value={2000} id={id2}>
                <div
                  id={id2}
                  className="italic [word-spacing:-10px] text-[24px] md:text-[40px]"
                >
                  2,000 +
                </div>
                <div className="text-black/60 text-[12px] md:text-[16px]">
                  High-Quality Products
                </div>
              </Counter>
              <div className="w-[1px] bg-black/10 hidden [@media(min-width:507px)]:block"></div>
              <Counter value={30000} id={id3}>
                <div
                  id={id3}
                  className="italic [word-spacing:-10px] text-[24px] md:text-[40px]"
                >
                  30,000 +
                </div>
                <div className="text-black/60 text-[12px] md:text-[16px]">
                  Happy Customers
                </div>
              </Counter>
            </div>
          </div>
        </PublicAppContainer>
      </div>
      <Image
        src={heroImg}
        alt="hero-image"
        className="h-[448px] md:h-[663px] object-cover object-[90%] sm:object-[120%] md:object-[80%] lg:object-[100%] w-full"
      />
    </div>
  )
}
