import React, { useEffect, useRef, useState } from 'react';
import { CircleCheck, Clock, XCircle, Download } from "lucide-react";
import { toast } from "sonner";

import { listPayments, downloadInvoice } from "@/services/profileService";

const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "successful":
      return "bg-green-50 text-green-700 border border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "failed":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "successful":
      return <CircleCheck className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};



interface EditInvoicesProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditInvoices: React.FC<EditInvoicesProps> = ({ activeEdit, onEdit }) => {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  // Fetch invoices when opened
  useEffect(() => {
    if (activeEdit !== "invoices") return;

    const fetchData = async () => {
      setLoading(true);
      const result = await listPayments();

      if (result.data) {
        setInvoices(result.data);
      } else {
        setError(result.message || "Unable to load invoices");
      }

      setLoading(false);
    };

    fetchData();
  }, [activeEdit]);

  // Close when clicking outside
  useEffect(() => {
    if (activeEdit !== 'invoices') return;

    const onPointerDown = (e: PointerEvent) => {
      if (!formRef.current) return;
      if (!formRef.current.contains(e.target as Node)) {
        onEdit(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeEdit, onEdit]);

  const openEdit = () => {
    if (!activeEdit) onEdit('invoices');
  };

  const handleDismiss = () => {
    onEdit(null);
  };

  const handleDownload = async (id: number) => {
    const result = await downloadInvoice(id);

    if (!result.data) {
      toast.info(result.message || "Unable to download invoice");
      return;
    }

    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();
    link.remove();
  };

  return (
    <div>
      {/* Display block - hidden when viewing */}
      {activeEdit !== 'invoices' && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Invoices</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">View your invoice</span>
            </div>

            <div
              onClick={openEdit}
              className={`cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
                ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`}
              role="button"
              tabIndex={0}
            >
              <span className={activeEdit ? 'text-gray-500' : ''}>View</span>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Summary - shown when active */}
      {activeEdit === 'invoices' && (
        <>
          {/* overlay disables all interaction/hover outside */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onMouseDown={() => onEdit(null)}
          />

          <div
            ref={formRef}
            className="edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm max-w-full mx-4 sm:mx-auto"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-5">
              <div className="font-semibold mb-2">Invoices</div>
            </div>

            <div className="px-4 sm:px-6 pb-5 overflow-x-auto">
              {/* Loading */}
              {loading && (
                <p className="text-center py-4 text-gray-500">Loading invoices...</p>
              )}

              {/* Error */}
              {error && (
                <p className="text-center py-4 text-red-500">{error}</p>
              )}

              {/* No invoices */}
              {!loading && invoices.length === 0 && !error && (
                <p className="text-center py-4 text-gray-500">No invoices found.</p>
              )}

              {/* Invoices list */}
              {invoices.length > 0 && (
                <div className="w-full">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-5 font-semibold text-gray-500 text-sm border-b border-gray-200 px-4 py-2">
                    <div>Date</div>
                    <div>Items</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div />
                  </div>

                  {invoices.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="bg-white border border-gray-200 rounded-md mt-3 p-4 md:p-0"
                    >
                      <div className="grid md:grid-cols-5 gap-3 items-center px-0 md:px-4 py-3">
                        {/* Date */}
                        <div className="text-sm text-gray-600">
                          <div className="md:hidden text-xs text-gray-500 mb-1">Date</div>
                          {new Date(inv.date).toLocaleDateString()}
                        </div>

                        {/* Item */}
                        <div className="text-sm md:font-medium text-gray-800">
                          <div className="md:hidden text-xs text-gray-500 mb-1">Items</div>
                          {inv.course}
                        </div>

                        {/* Status */}
                        <div>
                          <div className="md:hidden text-xs text-gray-500 mb-1">Status</div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusClasses(inv.status)}`}
                          >
                            {getStatusIcon(inv.status)}
                            {inv.status}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="text-sm md:font-medium text-gray-800">
                          <div className="md:hidden text-xs text-gray-500 mb-1">Amount</div>
                          {`₦${Number(inv.amount).toLocaleString()}`}
                        </div>

                        {/* Download */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDownload(inv.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-md py-2 px-3 hover:bg-gray-100 transition"
                          >
                            <Download className='w-4 h-4' />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dismiss */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleDismiss}
                  className="cursor-pointer text-gray-700 border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditInvoices;
