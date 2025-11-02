import  ProtectedRoute  from "@/components/ProtectedRoute";

export const metadata = {
  title: "Create Account",
  description: "Create your student account.",
};

export default function CreateAccountLayout({ children }: { children: React.ReactNode }) {
  return <><ProtectedRoute>{children}</ProtectedRoute></>;
}