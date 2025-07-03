import { useMemo, useState } from "react";

export type TSelectedHash = { [key: string]: boolean };

export default function useSelectTable() {
  const [selectedHash, setSelectedHash] = useState<TSelectedHash>({});

  const selectedLength = useMemo(
    () => Object.values(selectedHash).length,
    [selectedHash]
  );

  return {
    selectedHash,
    selectedLength,
    setSelectedHash,
  };
}
