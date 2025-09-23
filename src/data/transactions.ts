export type Transaction = {
  id: string;
  date: string;
  student: string;
  email: string;
  course: string;
  amount: number;
  method: "Stripe" | "Paystack";
  status: "success" | "failed" | "pending";
  reference: string;
};

export const transactions: Transaction[] = [
  {
    id: "txn_001",
    date: "2025-09-01",
    student: "Jane Doe",
    email: "jane@example.com",
    course: "React Basics",
    amount: 15000,
    method: "Stripe",
    status: "success",
    reference: "ref_ABC123",
  },
  {
    id: "txn_002",
    date: "2025-09-05",
    student: "John Smith",
    email: "john@example.com",
    course: "Next.js Mastery",
    amount: 22000,
    method: "Paystack",
    status: "failed",
    reference: "ref_XYZ789",
  },
  {
    id: "txn_003",
    date: "2025-09-08",
    student: "Mary Johnson",
    email: "mary@example.com",
    course: "Tailwind Pro",
    amount: 12000,
    method: "Stripe",
    status: "pending",
    reference: "ref_QWE456",
  },
];
