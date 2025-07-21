import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useLoadingCtx } from "./useLoadingCtx";

export default function useLoadingWhenRoutePush() {
  const { loading, setLoading } = useLoadingCtx();
  const router = useRouter();
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

  const push = (href: string, options?: NavigateOptions) => {
    startTransition(() => {
      router.push(href, options);
    });
  };

  return {
    push,
  };
}
