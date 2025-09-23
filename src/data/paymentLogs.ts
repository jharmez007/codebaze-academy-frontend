export type PaymentLog = {
  id: string;
  timestamp: string;
  provider: "Stripe" | "Paystack";
  event: string;
  status: "success" | "failed" | "retrying";
  details: string;
  payload: Record<string, any>; // ✅ raw JSON payload
};

export const paymentLogs: PaymentLog[] = [
  {
    id: "log_001",
    timestamp: "2025-09-20 10:23:45",
    provider: "Stripe",
    event: "payment_intent.succeeded",
    status: "success",
    details: "Payment of ₦15,000 confirmed for Jane Doe (React Basics).",
    payload: {
      id: "pi_12345",
      object: "payment_intent",
      amount: 15000,
      currency: "NGN",
      status: "succeeded",
      customer_email: "jane@example.com",
    },
  },
  {
    id: "log_002",
    timestamp: "2025-09-20 10:25:10",
    provider: "Paystack",
    event: "charge.failed",
    status: "failed",
    details: "Payment attempt of ₦22,000 failed for John Smith (Next.js Mastery).",
    payload: {
      event: "charge.failed",
      data: {
        id: "ch_67890",
        amount: 22000,
        currency: "NGN",
        status: "failed",
        customer: "john@example.com",
      },
    },
  },
  {
    id: "log_003",
    timestamp: "2025-09-20 10:27:33",
    provider: "Stripe",
    event: "invoice.payment_failed",
    status: "retrying",
    details: "Retrying charge for Mary Johnson (Tailwind Pro).",
    payload: {
      id: "in_55555",
      object: "invoice",
      amount_due: 12000,
      currency: "NGN",
      status: "open",
      attempts_remaining: 2,
    },
  },
];
