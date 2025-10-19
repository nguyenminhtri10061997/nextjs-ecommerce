"use client";

import { useLinkStatus } from "next/link";
import AppLineProgress from "../customComponents/appLineProgress";

export default function LinkLoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <AppLineProgress /> : null;
}
