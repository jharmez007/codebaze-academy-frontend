"use client";

// /app/reset-password/page.tsx
import dynamic from "next/dynamic";

const ResetPasswordPage = dynamic(() => import("./ResetPasswordClient"), {
  ssr: false, // important: render only on client
});

export default function Page() {
  return <ResetPasswordPage />;
}
