"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import PromotionForm from "./PromotionForm";
import PromoStats from "./PromoStats";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Promotion = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  course: string;
  expiry: string;
  usage: number;
  maxUsage: number;
};

export default function PromotionsTable({ data }: { data: Promotion[] }) {
  const [promos, setPromos] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [statsPromo, setStatsPromo] = useState<Promotion | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(promos.length / pageSize);
  const paginated = promos.slice((page - 1) * pageSize, page * pageSize);

  const handleSave = (promo: Promotion) => {
    if (editingPromo) {
      // update existing promo
      setPromos((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...promo, usage: p.usage } : p))
      );
    } else {
      // add new promo
      setPromos((prev) => [...prev, { ...promo, usage: 0 }]);
    }
    setIsOpen(false);
    setEditingPromo(null);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Promo Codes</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingPromo(null);
            setIsOpen(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Promo
        </Button>
      </div>

      {/* Table Wrapper for scroll */}
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                  No promotions found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell>
                    {promo.type === "percentage"
                      ? `${promo.value}%`
                      : `₦${promo.value.toLocaleString()}`}
                  </TableCell>
                  <TableCell>{promo.course}</TableCell>
                  <TableCell>
                    {new Date(promo.expiry).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {promo.usage}/{promo.maxUsage}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setStatsPromo(promo);
                          }}
                        >
                          View Stats
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingPromo(promo);
                            setIsOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <ConfirmModal
                          trigger={
                            <button className="w-full text-left px-2 py-1.5 text-sm text-red-700 hover:bg-red-100 rounded-sm">
                              Delete
                            </button>
                          }
                          title="Delete Promotion"
                          description={`Are you sure you want to delete ${promo.code}?`}
                          confirmLabel="Delete"
                          onConfirm={() => {
                            setPromos(promos.filter((p) => p.id !== promo.id));
                          }}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
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

      {/* Stats Modal */}
      {statsPromo && (
        <PromoStats
          open={!!statsPromo}
          onClose={() => setStatsPromo(null)}
          code={statsPromo.code}
          totalUsage={statsPromo.usage}
          maxUsage={statsPromo.maxUsage}
          courseStats={[
            {
              course: statsPromo.course,
              usage: statsPromo.usage,
              discountGiven:
                statsPromo.type === "percentage"
                  ? (statsPromo.value / 100) * 5000 * statsPromo.usage
                  : statsPromo.value * statsPromo.usage,
            },
          ]}
        />
      )}

      {/* Promotion Form Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promotion" : "Create Promotion"}
            </DialogTitle>
          </DialogHeader>
          <PromotionForm
            initialData={editingPromo || undefined}
            onSubmit={handleSave}
            onCancel={() => {
              setIsOpen(false);
              setEditingPromo(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
