import { getSegments } from '@/common';
import { DashboardCtx } from "@/contexts/dashboardCtx";
import { DictTypeGenerated } from "@/types/dictTypeGenerated";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardProvider({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: DictTypeGenerated
}) {
  const pathname = usePathname()
  const [breadcrumbs, setBreadCrumbs] = useState<string[]>(getSegments(pathname));

  useEffect(() => {
    const pathnameWithoutLang = pathname.substring(6)
    if (`/${breadcrumbs.join('/')}` === pathnameWithoutLang) {
      return
    }
    const segments = getSegments(pathname);
    setBreadCrumbs(segments)
  }, [pathname])

  return (
    <DashboardCtx
      value={{
        breadcrumbs,
        dict,
        setBreadCrumbs,
      }}
    >
      {children}
    </DashboardCtx>
  );
}
