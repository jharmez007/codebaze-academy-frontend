import dynamic from "next/dynamic";

// Load the actual client page without SSR
const AdminResetPasswordPage = dynamic(
  () => import("./reset-form"),
  { ssr: false }
);

export default function Page() {
  return <AdminResetPasswordPage />;
}
