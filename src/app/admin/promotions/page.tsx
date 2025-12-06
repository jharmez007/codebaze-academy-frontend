"use client";

import PromotionsTable from "@/components/admin/promotions/PromotionsTable";

export default function PromotionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Promotions</h1>
      <PromotionsTable />
    </div>
  );
}
