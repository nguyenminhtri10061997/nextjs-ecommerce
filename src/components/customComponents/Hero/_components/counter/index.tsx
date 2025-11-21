"use client"

import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { PropsWithChildren } from "react"

type TProps = PropsWithChildren<{
  id: string
  value: number
}>

export default function Counter({ id, value, children }: TProps) {
  useGSAP(() => {
    const el = document.getElementById(id)
    if (el) {
      const obj = {
        val: 0,
      }
      gsap.to(obj, {
        val: value,
        duration: 3,
        ease: "power1.out",
        onUpdate: () => {
          el.innerText = Math.floor(obj.val).toLocaleString() + " +"
        },
      })
    }
  })
  return <div>{children}</div>
}
