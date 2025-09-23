"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueOverview } from "@/components/admin/reports/RevenueOverview";
import { TransactionsTable } from "@/components/admin/reports/TransactionsTable";
import { PaymentLogs } from "@/components/admin/reports/PaymentLogs";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue & Reports</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        {/* Tab List */}
        <TabsList className="w-fit bg-muted p-1 rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="logs">Payment Logs</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <RevenueOverview />
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions">
          <TransactionsTable />
        </TabsContent>

        {/* Payment Logs */}
        <TabsContent value="logs">
          <PaymentLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
