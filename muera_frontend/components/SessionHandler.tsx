"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function SessionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sessionId = searchParams.get("userSessionId");
  const processed = useRef(false);

  useEffect(() => {
    if (sessionId && !processed.current && pathname !== "/cart") {
      processed.current = true;
      router.replace(`/cart?userSessionId=${sessionId}`);
    }
  }, [sessionId, pathname, router]);

  return null;
}
