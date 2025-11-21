"use client"

import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export default function AppQueryClientProvider({ children }: PropsWithChildren) {
    return (
                  <QueryClientProvider client={queryClient}>
                    {children}
                  </QueryClientProvider>
    )
}