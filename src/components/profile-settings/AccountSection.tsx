import React, { useState } from "react";
import EditName from "./EditName";
import EditEmail from "./EditEmail";
import EditPassword from "./EditPassword";
import EditSessions from "./EditSessions";
import ConfirmModal from "./ConfirmModal";

interface AccountSectionProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({
  activeEdit,
  onEdit,
}) => {
  const [open, setOpen] = useState(false);

  const rowClass = activeEdit
    ? "py-1 sm:px-2 rounded-md cursor-default"
    : "py-1 sm:px-2 rounded-md hover:bg-gray-100 cursor-pointer";

  // safe opener that prevents opening another edit while one is active
  const handleRowOpen = (key: string) => {
    if (activeEdit) return;
    onEdit && onEdit(key);
  };

  const handleRowKey = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRowOpen(key);
    }
  };

  return (
    <div className="border border-gray-300 sm:rounded-md mb-6">
      {/* Card Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 pt-5">
        <div>
          <h2 className="font-semibold text-black mb-3">Account</h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="sm:px-6 py-5">
        <div className="my-[-4px] mx-[-8px]">
          {/* Name row - clickable */}
          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("name")}
            onKeyDown={(e) => handleRowKey(e, "name")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Name
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditName activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>

          {/* Email row - clickable */}
          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("email")}
            onKeyDown={(e) => handleRowKey(e, "email")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Email
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditEmail activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>

          <div className={rowClass}
              role="button"
              tabIndex={activeEdit ? -1 : 0}
              onClick={() => handleRowOpen("password")}
              onKeyDown={(e) => handleRowKey(e, "password")}
              aria-disabled={!!activeEdit}
            >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Password
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditPassword activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>

          <div className={rowClass}
              role="button"
              tabIndex={activeEdit ? -1 : 0}
              onClick={() => handleRowOpen("sessions")}
              onKeyDown={(e) => handleRowKey(e, "sessions")}
              aria-disabled={!!activeEdit}
            >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">
                Sessions
              </div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditSessions activeEdit={activeEdit} onEdit={onEdit} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`underline inline-block cursor-pointer text-gray-400 ${
            activeEdit ? "opacity-50 pointer-events-none" : "hover:text-black"
          } mt-2 text-sm max-sm:px-4`}
          onClick={() => !activeEdit && setOpen(true)}
        >
          Delete my account
        </div>

        {open && <ConfirmModal onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
};

export default AccountSection;
