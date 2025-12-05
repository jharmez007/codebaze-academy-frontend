"use client";

import dynamic from "next/dynamic";

const AdminResetPasswordPage = dynamic(() => import("./reset-form"), {
  ssr: false,
});

export default function Page() {
  return <AdminResetPasswordPage />;
}
