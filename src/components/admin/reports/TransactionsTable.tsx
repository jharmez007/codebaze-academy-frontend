"use client";

import { useState } from "react";
import { transactions, Transaction } from "@/data/transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsToolbar } from "./TransactionsToolbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

// Export helpers
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function TransactionsTable() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("All");
  const [status, setStatus] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState<"date" | "amount" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // --- Filtering logic ---
  let filtered = transactions.filter((txn) => {
    if (
      search &&
      !`${txn.student} ${txn.course}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }
    if (method !== "All" && txn.method !== method) return false;
    if (status !== "All" && txn.status !== status) return false;
    return true;
  });

  // --- Sorting logic ---
  if (sortBy) {
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const dA = new Date(a.date).getTime();
        const dB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dA - dB : dB - dA;
      }
      if (sortBy === "amount") {
        return sortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
  }

  // --- Pagination logic ---
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // --- Export CSV ---
  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.csv");
  };

  // --- Export PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transactions Report", 14, 16);
    (doc as any).autoTable({
      startY: 22,
      head: [
        ["Date", "Student", "Course", "Amount", "Method", "Status", "Reference"],
      ],
      body: filtered.map((txn) => [
        txn.date,
        txn.student,
        txn.course,
        `₦${txn.amount.toLocaleString()}`,
        txn.method,
        txn.status,
        txn.reference,
      ]),
    });
    doc.save("transactions.pdf");
  };

  // --- Sorting handler ---
  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      // toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      <TransactionsToolbar
        search={search}
        setSearch={setSearch}
        method={method}
        setMethod={setMethod}
        status={status}
        setStatus={setStatus}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="text-gray-400 mb-2">📭</div>
                    <p className="text-sm text-muted-foreground mb-3">
                    No transactions found for current filters.
                    </p>
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setSearch("");
                        setMethod("All");
                        setStatus("All");
                    }}
                    >
                    Clear Filters
                    </Button>
                </div>
                </TableCell>
            </TableRow>
            ) : (
              paginated.map((txn: Transaction) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.student}</TableCell>
                  <TableCell>{txn.course}</TableCell>
                  <TableCell>₦{txn.amount.toLocaleString()}</TableCell>
                  <TableCell>{txn.method}</TableCell>
                  <TableCell
                    className={
                      txn.status === "success"
                        ? "text-green-600 font-medium"
                        : txn.status === "failed"
                        ? "text-red-600 font-medium"
                        : "text-yellow-600 font-medium"
                    }
                  >
                    {txn.status}
                  </TableCell>
                  <TableCell>{txn.reference}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
