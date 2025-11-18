import ClientDashboardLayoutLayout from "@/components/customComponents/ClientDashboardLayout";
import { ScopedCssBaseline } from "@mui/material";
import { getDictionary, TLang } from "../dictionaries";
import { roboto } from "@/constants/fonts";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: TLang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={roboto.className}>
    <ClientDashboardLayoutLayout dict={dict}>
      <ScopedCssBaseline>{children}</ScopedCssBaseline>
    </ClientDashboardLayoutLayout>
    </div>
  );
}
