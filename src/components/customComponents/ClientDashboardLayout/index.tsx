"use client"
import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import AlertProvider from "@/components/providers/AlertProvider"
import DashboardProvider from "@/components/providers/dashBoardProvider"
import LoadingProvider from "@/components/providers/loadingProvider"

export default function ClientDashboardLayoutLayout({
  children,
  dict,
}: {
  children: React.ReactNode
  dict: TReturnOfGetDictionary
}) {
  return (
    <LoadingProvider>
      <AlertProvider>
        <DashboardProvider dict={dict}>{children}</DashboardProvider>
      </AlertProvider>
    </LoadingProvider>
  )
}
