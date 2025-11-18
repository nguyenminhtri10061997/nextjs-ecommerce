"use client"

import { useRef } from "react"
import XIcon from '@public/svg/x-icon.svg'

export default function BannerCloseButton() {
  const parentRef = useRef<HTMLDivElement | null>(null)

  const handleCLick = () => {
    if (!parentRef.current) {
      parentRef.current = document.getElementById(
        "parent-content"
      ) as HTMLDivElement
    }
    if (!parentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(parentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          parentRef.current!.style.display = "none"
        },
      })
    })

    ctx.revert()
  }

  return (
    <button
      className="text-white absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
      aria-label="Close promotional banner"
      type="button"
      onClick={handleCLick}
    >
      <XIcon className="w-3 h-3" />
    </button>
  )
}
