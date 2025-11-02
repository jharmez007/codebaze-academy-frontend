import  ProtectedRoute  from "@/components/ProtectedRoute";

export const metadata = {
  title: "Thank You",
  description: "Thank you for your purchase.",
};

export default function ThankyouLayout({ children }: { children: React.ReactNode }) {
  return <><ProtectedRoute>{children}</ProtectedRoute></>;
}