import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditPasswordProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditPassword: React.FC<EditPasswordProps> = ({ activeEdit, onEdit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);

  // When edit opens, reset fields
  useEffect(() => {
    if (activeEdit === "password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [activeEdit]);

  // Close edit when clicking outside form
  useEffect(() => {
    if (activeEdit !== "password") return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (formRef.current && target && !formRef.current.contains(target)) {
        onEdit && onEdit(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeEdit, onEdit]);

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("password");
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onEdit && onEdit(null);
  };

  const isFormValid =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 6 &&
    /\d/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    confirmPassword === newPassword;

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    toast.success("Password updated");
    onEdit && onEdit(null);
  };

  return (
    <div>
      {/* Display block - hidden when editing */}
      {activeEdit !== "password" && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Password</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">
                 {!currentPassword ? "Change your password" : " "}
              </span>
              <div className='truncate text-wrap text-black text-xl'>{currentPassword ? "••••••••" : ""}</div>
            </div>
            <div
              onClick={openEdit}
              className={`cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4 ${
                activeEdit
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-gray-300"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (!activeEdit && (e.key === "Enter"))
                  openEdit();
              }}
              aria-disabled={!!activeEdit}
            >
              <span>Edit</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form - shown when editing */}
      {activeEdit === "password" && (
        <>
          <div
            className="fixed inset-0 bg-transparent z-40"
            onMouseDown={() => onEdit && onEdit(null)}
            aria-hidden
          />
          <div
            ref={formRef}
            className="edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm"
          >
            {/* Header */}
            <div className="px-6 pt-5">
              <div className="font-semibold text-base">Password</div>
              <p className="text-gray-500 mt-1 text-[13px]">
                Your new password should be at least 6 characters, including at
                least one number and special character.
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label
                    htmlFor="currentPassword"
                    className="block mb-1 font-medium"
                  >
                    Current password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className="block mb-1 font-medium"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-1 font-medium"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end flex-wrap gap-2">
                  <button
                    onClick={handleDiscard}
                    className="cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1.5 px-4 text-sm hover:bg-gray-100 transition ease-in"
                    type="button"
                  >
                    Discard
                  </button>
                  <button
                    className={`cursor-pointer text-white rounded-md py-1.5 px-4 text-sm ${
                      isFormValid
                        ? "bg-[#06040E] border border-[#06040E]"
                        : "bg-gray-300 border border-gray-300 pointer-events-none"
                    }`}
                    type="submit"
                    disabled={!isFormValid}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditPassword;
