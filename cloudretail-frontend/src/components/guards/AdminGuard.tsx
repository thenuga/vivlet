"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * DEV-ONLY Admin Guard
 * ----------------------------------
 * This is intentionally simple for MVP.
 * Later we will replace this with real JWT + backend auth.
 */
export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 🔒 TEMPORARY DEV CHECK
    const isAdmin = localStorage.getItem("cloudretail_is_admin") === "true";

    if (!isAdmin) {
      router.replace("/forbidden");
    }
  }, [router]);

  return <>{children}</>;
}
