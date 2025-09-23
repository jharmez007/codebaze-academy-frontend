"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FileDown } from "lucide-react";

type Props = {
  search: string;
  setSearch: (val: string) => void;
  method: string;
  setMethod: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
};

export function TransactionsToolbar({
  search,
  setSearch,
  method,
  setMethod,
  status,
  setStatus,
  onExportCSV,
  onExportPDF,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      {/* Left side: search + filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />

        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Methods</SelectItem>
            <SelectItem value="Stripe">Stripe</SelectItem>
            <SelectItem value="Paystack">Paystack</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side: export buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onExportCSV}>
          <FileDown className="w-4 h-4 mr-1" /> CSV
        </Button>
        <Button size="sm" variant="outline" onClick={onExportPDF}>
          <FileDown className="w-4 h-4 mr-1" /> PDF
        </Button>
      </div>
    </div>
  );
}
