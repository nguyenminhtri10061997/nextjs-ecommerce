import { useEffect, useTransition } from "react";
import { useLoadingCtx } from "./useLoadingCtx";

export default function useLoadingWhenRoutePush() {
  const { loading, setLoading } = useLoadingCtx();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending && !loading) {
      setLoading(true);
    }

    return () => {
      if (loading) {
        setLoading(false);
      }
    };
  }, [isPending, loading, setLoading]);

  return {
    startTransition,
  };
}
