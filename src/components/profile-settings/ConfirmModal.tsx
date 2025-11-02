import React, { useEffect, useRef, useState } from "react";

interface ConfirmModalProps {
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onClose }) => {
  const [checked, setChecked] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (modalRef.current && target && !modalRef.current.contains(target)) {
        onClose();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-md w-full max-w-xl p-6 animate-fadeIn"
      >
        <h2 className="text-lg font-semibold text-black mb-3">Delete account</h2>
        <p className="text-gray-700 mb-4">
          If you delete your account, you will lose access to all content you
          signed up for and not be able to recover it in the future.
        </p>

        <div className="flex items-center mb-5">
          <input
            id="confirmCheck"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="mr-2"
          />
          <label
            htmlFor="confirmCheck"
            className="text-gray-700 select-none"
          >
            I have read and understand the repercussions.
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            Keep account
          </button>
          <button
            disabled={!checked}
            className={`px-4 py-1 rounded-md font-medium transition ${
              checked
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
