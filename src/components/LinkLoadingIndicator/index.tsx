"use client";

import { useLinkStatus } from "next/link";
import AppLineProgress from "../AppLineProgress";

export default function LinkLoadingIndicator() {
  const { pending } = useLinkStatus();
  console.log({pending})
  // return pending ? <AppLineProgress /> : null;

  return pending ? <div style={{ position: 'fixed', top: 0, right: 0 }}>asdadsfasjdfasdlkfadfl</div> : <div id="test" style={{ position: 'fixed', top: 0, right: 0 }}>asdadsfasjdfasdlkfadfl</div>;
}
