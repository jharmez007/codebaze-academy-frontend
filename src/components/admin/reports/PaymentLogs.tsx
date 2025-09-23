"use client";

import { useState } from "react";
import { paymentLogs, PaymentLog } from "@/data/paymentLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PaymentLogModal } from "./PaymentLogModal";

export function PaymentLogs() {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<PaymentLog | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = paymentLogs.filter(
    (log) =>
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.event.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: PaymentLog["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      case "retrying":
        return <Badge className="bg-yellow-100 text-yellow-700">Retrying</Badge>;
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Payment Logs</h2>

      {/* Search bar */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Search events or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[280px]"
        />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-6"
                >
                  No payment logs found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell className="text-sm">{log.provider}</TableCell>
                  <TableCell className="text-sm">{log.event}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-sm">{log.details}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLog(log);
                        setOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <PaymentLogModal
        open={open}
        onOpenChange={setOpen}
        log={
          selectedLog
            ? {
                id: selectedLog.id,
                event: selectedLog.event,
                provider: selectedLog.provider,
                payload: selectedLog.payload,
              }
            : null
        }
      />
    </div>
  );
}
