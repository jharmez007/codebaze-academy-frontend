"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { changeEmail, verifyNewEmail } from "@/services/authService";
import { getProfile } from "@/services/profileService";

interface EditEmailProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditEmail: React.FC<EditEmailProps> = ({ activeEdit, onEdit }) => {
  const [savedEmail, setSavedEmail] = useState("");
  const [email, setEmail] = useState(savedEmail);

  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      async function loadProfile() {
        const result = await getProfile();
        if (result.data) {
          setSavedEmail(result.data.email ?? "");
        }
      }
      loadProfile();
    }, []);

  // preload email
  useEffect(() => {
    if (activeEdit === "email") setEmail(savedEmail);
  }, [activeEdit, savedEmail]);

  // close on click outside
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    toast.loading("Sending verification code...");

    const res = await changeEmail(email.trim());

    toast.dismiss();

    if (res?.status === 200) {
      toast.success("Verification code sent!");
      setShowVerification(true);
    } else {
      toast.error(res?.message || "Could not update email");
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;

    toast.loading("Verifying...");

    const res = await verifyNewEmail(email.trim(), verificationCode.trim());

    toast.dismiss();

    if (res?.status === 200) {
      toast.success("Email updated successfully!");
      setSavedEmail(email.trim());
      setShowVerification(false);
      onEdit(null);
    } else {
      toast.error(res?.message || "Invalid verification code");
    }
  };

  return (
    <div>
      {/* Display mode */}
      {activeEdit !== "email" && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Email</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">
                {!savedEmail ? "Change your email" : " "}
              </span>
              <div className="truncate">{savedEmail}</div>
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
              onKeyDown={(e) => e.key === "Enter" && !activeEdit && openEdit()}
            >
              Edit
            </div>
          </div>
        </div>
      )}

      {/* Edit form */}
      {activeEdit === "email" && !showVerification && (
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
            <div className="px-6 pt-5">
              <div className="font-semibold text-base">Email</div>
              <p className="text-gray-500 mt-1 text-[13px]">
                Your email is only shared with the creator for important
                notifications.
              </p>
            </div>

            <div className="px-6 py-5">
              <form onSubmit={handleSave}>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. picard@starfleet.org"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="text-[#717073] border border-gray-300 rounded-md py-1.5 px-4 text-sm hover:bg-gray-100"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`text-white rounded-md py-1.5 px-4 text-sm ${
                      isValid
                        ? "bg-[#06040E]"
                        : "bg-gray-300 pointer-events-none"
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

      {/* Verification modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold">Verify New Email</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter the 6-digit verification code sent to:
            </p>
            <p className="font-medium mt-1">{email}</p>

            <input
              type="text"
              maxLength={6}
              placeholder="Verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-4 w-full border border-gray-300 rounded-md px-3 py-2"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm border rounded-md"
                onClick={() => setShowVerification(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-sm bg-black text-white rounded-md"
                onClick={handleVerify}
                disabled={!verificationCode.trim()}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmail;
