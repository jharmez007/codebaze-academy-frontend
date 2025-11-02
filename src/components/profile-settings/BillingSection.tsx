"use client";

import React from "react";
import { useRouter } from "next/navigation";
import EditCommunity from "./EditCommunity";
import EditPaymentMethod from "./EditPaymentMethod";
import EditInvoices from "./EditInvoices";

interface BillingSectionProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const BillingSection: React.FC<BillingSectionProps> = ({
  activeEdit,
  onEdit,
}) => {
  const router = useRouter();

  const rowClass = activeEdit
    ? "py-1 sm:px-2 rounded-md cursor-default"
    : "py-1 sm:px-2 rounded-md hover:bg-gray-100 cursor-pointer";

  // open a row for editing (no-op if another edit is active)
  const handleRowOpen = (key: string) => {
    if (activeEdit) return;
    onEdit && onEdit(key);
  };

  // keyboard handler to open row with Enter or Space
  const handleRowKey = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowOpen(key);
    }
  };

  // New: route to 404 for the Community row when clicked (when no edit is active)
  const handleCommunityClick = () => {
    if (activeEdit) return;
    router.push("/not-found");
  };
  const handleCommunityKey = (e: React.KeyboardEvent) => {
    if (activeEdit) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push("/not-found");
    }
  };

  return (
    <div className="border border-gray-300 sm:rounded-md mb-6">
      {/* Card Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 pt-5">
        <div>
          <h2 className="font-semibold text-black mb-3">Billing</h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="sm:px-6 py-5">
        <div className="my-[-4px] mx-[-8px]">
          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={handleCommunityClick}
            onKeyDown={handleCommunityKey}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Community
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditCommunity activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>

          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("payment-method")}
            onKeyDown={(e) => handleRowKey(e, "payment-method")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Payment Method
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditPaymentMethod activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>

          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("invoices")}
            onKeyDown={(e) => handleRowKey(e, "invoices")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Invoices
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditInvoices activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
