import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Square } from "lucide-react";

interface EditNotificationsProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditNotifications: React.FC<EditNotificationsProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved states
  const [savedSettings, setSavedSettings] = useState({
    allowEmails: true,
    emailMessages: true,
    inAppMessages: true,
    soundMessages: true,
  });

  // local editable copy
  const [settings, setSettings] = useState(savedSettings);

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeEdit === "notifications") {
      setSettings(savedSettings);
    }
  }, [activeEdit, savedSettings]);

  useEffect(() => {
    if (activeEdit !== "notifications") return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!formRef.current) return;
      if (target && !formRef.current.contains(target)) {
        onEdit && onEdit(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeEdit, onEdit]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setSettings(savedSettings);
    onEdit && onEdit(null);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSavedSettings(settings);
    onEdit && onEdit(null);
    toast.success("Notification preferences updated");
  };

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("notifications");
  };

  return (
    <div>
      {/* Display block - hidden when editing */}
      {activeEdit !== "notifications" && (
        <div className="text-sm max-sm:px-6">
          <div className="block md:hidden font-semibold">Notifications</div>
          <div className="flex justify-between items-center">
            <div className="truncate mr-3">
              <span className="text-gray-400">
                Manage email and in-app notifications.
              </span>
            </div>

            {/* Edit control */}
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
                if (!activeEdit && (e.key === "Enter" || e.key === " "))
                  openEdit();
              }}
              aria-disabled={!!activeEdit}
            >
              <span className={activeEdit ? "text-gray-500" : ""}>Edit</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form - shown when editing */}
      {activeEdit === "notifications" && (
        <>
          {/* overlay disables all interaction/hover outside the form */}
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
            <div className="flex justify-between items-center px-6 pt-5">
              <div>
                <div className="font-semibold">Notifications</div>
                <p className="text-[13px] text-gray-500">
                  Manage email and in-app notifications.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <form onSubmit={handleSave} className="space-y-5">
                {/* General */}
                <div>
                  <div className="font-semibold mb-2">General</div>
                  <div
                    className="flex flex-col items-start gap-1"
                    onClick={() => handleToggle("allowEmails")}
                  >
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleToggle("allowEmails"); }}
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-sm transition focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                          settings.allowEmails ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-400"
                        }`}
                        aria-pressed={settings.allowEmails}
                        tabIndex={0}
                      >
                        {settings.allowEmails ? (
                          <Check size={12} />
                        ) : (
                          ""
                        )}
                      </button>
                       <div>Allow CodeBaze Academy to send me emails.</div>
                     </div>
                       <p className="text-[13px] text-gray-500">
                         No matter what’s selected, important account and billing
                         emails will be sent.
                       </p>
                   </div>
                </div>

                {/* Messaging */}
                <div>
                  <div className="font-semibold mb-2">Messaging</div>
                  <div className="space-y-3">
                    {[
                      {
                        key: "emailMessages",
                        label: "Send me email notifications for new messages.",
                      },
                      {
                        key: "inAppMessages",
                        label: "Show me in-app notifications for new messages.",
                      },
                      {
                        key: "soundMessages",
                        label: "Play a sound when receiving new messages.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-3"
                        onClick={() =>
                          handleToggle(item.key as keyof typeof settings)
                        }
                      >
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleToggle(item.key as keyof typeof settings); }}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-sm transition focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                            settings[item.key as keyof typeof settings] ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-400"
                          }`}
                          aria-pressed={settings[item.key as keyof typeof settings]}
                          tabIndex={0}
                        >
                          {settings[item.key as keyof typeof settings] ? <Check size={12} /> : ""}
                        </button>
                         <div>{item.label}</div>
                       </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end flex-wrap gap-2 pt-4">
                  <button
                    onClick={handleDiscard}
                    className="cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in"
                    type="button"
                  >
                    Discard
                  </button>
                  <button
                    className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm ${
                      "bg-[#06040E] border border-[#06040E]"
                    }`}
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

export default EditNotifications;
