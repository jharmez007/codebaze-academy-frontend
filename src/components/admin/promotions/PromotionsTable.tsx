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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import PromotionForm from "./PromotionForm";
import PromoStats from "./PromoStats";

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
    <div>
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

      {/* Table */}
      <Table>
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
          {promos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No promotions found
              </TableCell>
            </TableRow>
          ) : (
            promos.map((promo) => (
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
                    ? (statsPromo.value / 100) * 5000 * statsPromo.usage // example calc
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
