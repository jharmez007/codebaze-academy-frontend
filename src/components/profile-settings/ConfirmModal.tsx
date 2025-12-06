import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { deleteAccount } from "@/services/profileService"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter  } from "next/navigation";

interface ConfirmModalProps {
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onClose }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { logout } = useAuth();

  // close on outside click + ESC
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

  const canDelete = checked && password.trim().length > 0 && !loading;

  const handleDelete = async () => {
    if (!canDelete) return;

    setLoading(true);
    setError(null);

    const res = await deleteAccount({ password });

    if (res?.status === 200) {
      logout();
      router.push("/");
      toast.success("Account deleted successfully.");
      return;
    }

    // Show server error
    setError(res?.message || "Something went wrong.");
    setLoading(false);
  };

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

        {/* Error */}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded mb-3">
            {error}
          </p>
        )}

        {/* Password field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm password</label>
          <input
            type="password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-red-200 disabled:bg-gray-100"
            placeholder="Enter your password"
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center mb-5">
          <input
            id="confirmCheck"
            type="checkbox"
            checked={checked}
            disabled={loading}
            onChange={() => setChecked(!checked)}
            className="mr-2"
          />
          <label htmlFor="confirmCheck" className="text-gray-700 select-none">
            I have read and understand the repercussions.
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-600 hover:text-black disabled:opacity-50"
          >
            Keep account
          </button>

          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className={`px-4 py-1 rounded-md font-medium transition ${
              canDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
