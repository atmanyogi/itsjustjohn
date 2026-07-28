"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackLocalEvent } from "@/app/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Record page view event inside client-side database
    trackLocalEvent("page_view");
  }, [pathname, searchParams]);

  return null;
}
