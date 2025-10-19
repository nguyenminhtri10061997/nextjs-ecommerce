import LocalizationProviderMUIProvider from "@/components/providers/LocalizationProviderMUIDatePicker";
import { roboto } from "@/constants/fonts";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className={"antialiased"}>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider>
          <LocalizationProviderMUIProvider>
            {children}
          </LocalizationProviderMUIProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
