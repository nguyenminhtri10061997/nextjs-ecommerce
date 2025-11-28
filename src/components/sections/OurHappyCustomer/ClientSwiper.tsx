"use client"
import { useEffect } from "react"
import Swiper from "swiper"
import "swiper/swiper-bundle.css"

export default function ClientSwiper() {
  useEffect(() => {
    new Swiper(".swiper", {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: true,
      centeredSlides: true,
      parallax: true,
      grabCursor: true,

      on: {
        afterInit(swiperI) {
          updateBlur(swiperI)

          const arrLeft = document.getElementById("arr-left")
          const arrRight = document.getElementById("arr-right")
          arrLeft?.addEventListener("click", () => {
            swiperI.slidePrev()
          })
          arrRight?.addEventListener("click", () => {
            swiperI.slideNext()
          })

          handleResize(swiperI)
          window.addEventListener("resize", () => handleResize(swiperI))
        },
        slideChange(swiperI) {
          updateBlur(swiperI)
        },
      },
    })
    function updateBlur(swiperI: Swiper) {
      const activeIndex = swiperI.activeIndex
      const slidesView = swiperI.params.slidesPerView

      swiperI.slides.forEach((slide, index) => {
        const diff = Math.abs(index - activeIndex)

        if ((slidesView as number) <= 2) {
          slide.style.filter = diff >= 1 ? "blur(1px)" : "none"
        } else {
          slide.style.filter = diff >= 2 ? "blur(1px)" : "none"
        }
      })
    }

    function handleResize(swiperI: Swiper) {
      let slidesView = 4
      const w = window.innerWidth

      if (w <= 390) slidesView = 1
      else if (w <= 640) slidesView = 2
      else if (w <= 1024) slidesView = 3
      else slidesView = 4

      if (swiperI.params.slidesPerView !== slidesView) {
        swiperI.params.slidesPerView = slidesView
        swiperI.update()
      }
    }
  }, [])

  return null // Chỉ lo JS, UI đã có ở Server Component
}
