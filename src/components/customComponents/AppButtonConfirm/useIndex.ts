import { useState } from "react";

export default function useIndex() {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  return {
    isOpenConfirm,
    setIsOpenConfirm,
  };
}
