import ClientDashboardLayoutLayout from "@/components/ClientDashboardLayout";
import { TLang } from "@/types/dictionaries";
import { getDictionary } from "../dictionaries";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: TLang }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <ClientDashboardLayoutLayout dict={dict}>
      {children}
    </ClientDashboardLayoutLayout>
  );
}
