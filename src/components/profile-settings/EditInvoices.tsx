import React, { useEffect, useRef, useState } from 'react'
import { CircleCheck, Download } from "lucide-react"

interface EditInvoicesProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditInvoices: React.FC<EditInvoicesProps> = ({
  activeEdit,
  onEdit,
}) => {
  const formRef = useRef<HTMLDivElement | null>(null);

  // Simulated invoice data (can later come from props or API)
  const [invoice] = useState({
    date: 'Today',
    item: 'Frontend Foundations',
    status: 'Paid',
    amount: '$0.00',
  });

  // Close when clicking outside
  useEffect(() => {
    if (activeEdit !== 'invoices') return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!formRef.current) return;
      if (target && !formRef.current.contains(target)) {
        onEdit && onEdit(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeEdit, onEdit]);

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit('invoices');
  };

  const handleDismiss = () => {
    onEdit && onEdit(null);
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
              onKeyDown={(e) => {
                if (!activeEdit && (e.key === 'Enter' || e.key === ' ')) openEdit();
              }}
              aria-disabled={!!activeEdit}
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
            onMouseDown={() => onEdit && onEdit(null)}
            aria-hidden
          />

          <div
            ref={formRef}
            className="edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm max-w-full mx-4 sm:mx-auto"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-5">
              <div className="font-semibold mb-2">Invoices</div>
            </div>

            {/* Table-like content */}
            <div className="px-4 sm:px-6 pb-5 overflow-x-auto">
              {/* container allows horizontal scroll on very small screens but adapts to stacked cards */}
              <div className="w-full">
                {/* Grid header for md+ screens */}
                <div className="hidden md:grid grid-cols-5 font-semibold text-gray-500 text-sm border-b border-gray-200 px-4 py-2">
                  <div>Date</div>
                  <div>Items</div>
                  <div>Status</div>
                  <div>Amount</div>
                  <div />
                </div>

                {/* Single invoice - responsive: stacked on small, row on md+ */}
                <div className="bg-white border border-gray-200 rounded-md mt-3 p-4 md:p-0">
                  <div className="grid md:grid-cols-5 gap-3 items-center px-0 md:px-4 py-3">
                    {/* Date */}
                    <div className="text-sm text-gray-600 md:py-0">
                      <div className="md:hidden text-xs text-gray-500 mb-1">Date</div>
                      {invoice.date}
                    </div>

                    {/* Item */}
                    <div className="text-sm md:font-medium text-gray-800 md:py-0">
                      <div className="md:hidden text-xs text-gray-500 mb-1">Items</div>
                      {invoice.item}
                    </div>

                    {/* Status */}
                    <div className="md:py-0">
                      <div className="md:hidden text-xs text-gray-500 mb-1">Status</div>
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full border border-green-200">
                        <CircleCheck className='w-4 h-4' />
                        {invoice.status}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="text-sm md:font-medium text-gray-800 md:py-0">
                      <div className="md:hidden text-xs text-gray-500 mb-1">Amount</div>
                      {invoice.amount}
                    </div>

                    {/* Actions: full width on small, right aligned on md+ */}
                    <div className="flex justify-end md:justify-end">
                      <button
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-md py-2 px-3 hover:bg-gray-100 transition w-full md:w-auto"
                        onClick={() => console.log('Download PDF')}
                      >
                        <Download className='w-4 h-4' />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dismiss button */}
              <div className="flex justify-end mt-4 px-0 sm:px-0">
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
