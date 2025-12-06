import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/services/authService"; 


interface EditPasswordProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditPassword: React.FC<EditPasswordProps> = ({ activeEdit, onEdit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  apiError: "",
});

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

  const validateForm = () => {
  const newErrors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    apiError: "",
  };

  if (!currentPassword.trim()) {
    newErrors.currentPassword = "Current password is required.";
  }

  if (newPassword.length < 6) {
    newErrors.newPassword = "Password must be at least 6 characters.";
  } else if (!/\d/.test(newPassword)) {
    newErrors.newPassword = "Password must include at least one number.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    newErrors.newPassword = "Password must include a special character.";
  }

  if (confirmPassword !== newPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);

  return (
    !newErrors.currentPassword &&
    !newErrors.newPassword &&
    !newErrors.confirmPassword
  );
};


  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onEdit && onEdit(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
  e?.preventDefault();

  const isValid = validateForm();
  if (!isValid) return;

  try {
    const response = await changePassword({
      old_password: currentPassword,
      new_password: newPassword,
    });

    if (response.status === 200) {
      toast.success("Password updated");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        apiError: "",
      });

      onEdit && onEdit(null);
    } else {
      setErrors((prev) => ({
        ...prev,
        apiError: response.message || "Failed to update password",
      }));
    }
  } catch {
    setErrors((prev) => ({
      ...prev,
      apiError: "Something went wrong. Please try again.",
    }));
  }
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
                 {!currentPassword ? "••••••••" : " "}
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
              {errors.apiError && (
                <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-3 py-2 rounded mb-4">
                  {errors.apiError}
                </div>
              )}
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
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors.currentPassword
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-gray-500"
                    }`}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, currentPassword: "" }));
                    }}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                  )}
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
                    placeholder="••••••••"
                    type="password"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors.newPassword
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-gray-500"
                    }`}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                  )}
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
                    placeholder="••••••••"
                    type="password"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-gray-500"
                    }`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
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
                   className="cursor-pointer text-white rounded-md py-1.5 px-4 text-sm bg-[#06040E] border border-[#06040E] hover:opacity-90"
                   type="submit"
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
