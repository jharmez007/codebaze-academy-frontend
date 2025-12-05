import dynamic from "next/dynamic";

// Dynamically import the client-only page
const VerifyEmailPage = dynamic(() => import("./VerifyEmailClient"), {
  ssr: false, // ← important
});

export default function Page() {
  return <VerifyEmailPage />;
}
