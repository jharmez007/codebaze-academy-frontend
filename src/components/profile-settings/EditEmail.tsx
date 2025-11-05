"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditEmailProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditEmail: React.FC<EditEmailProps> = ({ activeEdit, onEdit }) => {
  const [savedEmail, setSavedEmail] = useState("");
  const [email, setEmail] = useState(savedEmail);
  const formRef = useRef<HTMLDivElement | null>(null);

  // When edit mode activates, preload saved email
  useEffect(() => {
    if (activeEdit === "email") setEmail(savedEmail);
  }, [activeEdit, savedEmail]);

  // Close form on outside click
  useEffect(() => {
    if (activeEdit !== "email") return;
    const handleOutside = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onEdit(null);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [activeEdit, onEdit]);

  const isValid = email.trim() !== "" && /\S+@\S+\.\S+/.test(email);

  const openEdit = () => {
    if (!activeEdit) onEdit("email");
  };

  const handleDiscard = () => {
    setEmail(savedEmail);
    onEdit(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSavedEmail(email.trim());
    toast.success("Email updated");
    onEdit(null);
  };

  return (
    <div>
      {/* Display state */}
      {activeEdit !== "email" && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Email</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">
                {!savedEmail ? "Change your email" : " "}
              </span>
              <div className='truncate text-wrap'>{savedEmail}</div>
            </div>
            <div
              onClick={openEdit}
              role="button"
              tabIndex={0}
              className={`cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4 ${
                activeEdit
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-gray-300"
              }`}
              onKeyDown={(e) => {
                if (!activeEdit && (e.key === "Enter")) openEdit();
              }}
            >
              <span>Edit</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {activeEdit === "email" && (
        <>
          <div
            className="fixed inset-0 bg-transparent z-40"
            onMouseDown={() => onEdit(null)}
            aria-hidden
          />
          <div
            ref={formRef}
            className="edit-form z-50 relative flex flex-col bg-white border border-gray-300 rounded-md text-sm"
          >
            {/* Header */}
            <div className="px-6 pt-5">
              <div className="font-semibold text-base">Email</div>
              <p className="text-gray-500 mt-1 text-[13px]">
                Your email is only shared with the creator for sending important
                emails and notifications. You can change your email notification
                settings separately.
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <form onSubmit={handleSave}>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. picard@starfleet.org"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Footer buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1.5 px-4 text-sm hover:bg-gray-100 transition ease-in"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`cursor-pointer text-white rounded-md py-1.5 px-4 text-sm ${
                      isValid
                        ? "bg-[#06040E] border border-[#06040E]"
                        : "bg-gray-300 border border-gray-300 pointer-events-none"
                    }`}
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

export default EditEmail;
