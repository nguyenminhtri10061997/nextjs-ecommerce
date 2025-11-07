import { useState } from "react"

export default function useAppConfirmDialog() {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)
  return {
    isOpenConfirm,
    setIsOpenConfirm,
  }
}
