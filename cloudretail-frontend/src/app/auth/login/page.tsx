"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next");

  return <LoginForm next={next} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
