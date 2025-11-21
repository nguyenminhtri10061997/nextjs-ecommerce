"use client"

import { gsap, useGSAP } from "@/lib/gsap"
import MenuIcon from "@public/svg/menu.svg"
import XIcon from "@public/svg/x-icon.svg"
import { useState } from "react"

export default function MenuToggle() {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    setOpen((prev) => !prev)
  }

  // useEffect(() => {
  //   const ulEl = document.getElementById("menu-ul")
  //   if (!ulEl) return

  //   const ctx = gsap.context(() => {
  //     if (open) {
  //       ulEl.classList.add('open')

  //       gsap.fromTo(
  //         ulEl,
  //         { opacity: 0, y: -10 },
  //         { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
  //       )
  //     } else {
  //       gsap.to(ulEl, {
  //         opacity: 0,
  //         y: -10,
  //         duration: 0.25,
  //         ease: "power2.in",
  //         onComplete: () => {
  //           gsap.set(ulEl, { clearProps: "all" })
  //           ulEl.classList.remove('open')
  //         },
  //       })
  //     }
  //   })

  //   return () => ctx.revert()
  // }, [open])

  useGSAP(
    () => {
      const ulEl = document.getElementById("menu-ul")
      if (!ulEl) return

      if (open) {
        ulEl.classList.add("open")

        gsap.fromTo(
          ulEl,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        )
      } else {
        gsap.to(ulEl, {
          opacity: 0,
          y: -10,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(ulEl, { clearProps: "all" })
            ulEl.classList.remove("open")
          },
        })
      }
    },
    {
      dependencies: [open],
    }
  )

  return (
    <button
      id="btnMenu"
      className="w-[1.1719rem] h-[0.8906rem] md:hidden cursor-pointer"
      onClick={toggle}
    >
      {open ? <XIcon /> : <MenuIcon />}
    </button>
  )
}
