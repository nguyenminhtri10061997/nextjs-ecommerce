'use client'
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import calvinKlein from "@public/images/calvin-klein.png"
import gucciLogo from "@public/images/gucci-logo.png"
import pradaLogo from "@public/images/prada-logo.png"
import verSaceLogo from "@public/images/versace.png"
import zaraLogo from "@public/images/zara-logo.png"
import Image from "next/image"

export default function BrandSlider() {
  useGSAP(() => {
    const logoMarquee = document.getElementById("logo-marquee")
    if (logoMarquee) {
      gsap.to("#logo-marquee", {
        x: -logoMarquee.clientWidth / 3 - 106 / 3,
        duration: 20,
        ease: "none",
        repeat: -1,
      })
    }
  })

  return (
    <div className="bg-black py-[40px] lg:py-[44px] overflow-hidden">
      <div id="logo-marquee" className="flex gap-x-[106px] w-max">
        <Image src={verSaceLogo} alt="verSaceLogo" />
        <Image src={zaraLogo} alt="zaraLogo" />
        <Image src={gucciLogo} alt="gucciLogo" />
        <Image src={pradaLogo} alt="pradaLogo" />
        <Image src={calvinKlein} alt="calvinKlein" />
        <Image src={verSaceLogo} alt="verSaceLogo" />
        <Image src={zaraLogo} alt="zaraLogo" />
        <Image src={gucciLogo} alt="gucciLogo" />
        <Image src={pradaLogo} alt="pradaLogo" />
        <Image src={calvinKlein} alt="calvinKlein" />
        <Image src={verSaceLogo} alt="verSaceLogo" />
        <Image src={zaraLogo} alt="zaraLogo" />
        <Image src={gucciLogo} alt="gucciLogo" />
        <Image src={pradaLogo} alt="pradaLogo" />
        <Image src={calvinKlein} alt="calvinKlein" />
      </div>
    </div>
  )
}
