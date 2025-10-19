import { TLang } from "@/types/dictionaries";
import { getDictionary } from "../dictionaries";
import ClientDashboardLayoutLayout from "@/components/customComponents/clientDashboardLayout";

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
    <ClientDashboardLayoutLayout dict={dict}>
      {children}
    </ClientDashboardLayoutLayout>
  );
}
