import React from "react";
import EditPhoto from "./EditPhoto";
import EditBio from "./EditBio";
import EditSocials from "./EditSocials";
import EditNotifications from "./EditNotifications";

interface OptionsSectionProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  activeEdit,
  onEdit,
}) => {
  const rowClass = activeEdit
    ? "py-1 sm:px-2 rounded-md cursor-default"
    : "py-1 sm:px-2 rounded-md hover:bg-gray-100 cursor-pointer";

  // open a row for editing (no-op if another edit is active)
  const handleRowOpen = (key: string) => {
    if (activeEdit) return;
    onEdit && onEdit(key);
  };

  // keyboard handler to open row with Enter or Space
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
          <h2 className="font-semibold text-black mb-3">Options</h2>
        </div>
      </div>

      {/* Card Body */}
      <div className="sm:px-6 py-5">
        <div className="my-[-4px] mx-[-8px]">
          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("photo")}
            onKeyDown={(e) => handleRowKey(e, "photo")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">Photo</div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditPhoto
                  activeEdit={activeEdit}
                  onEdit={onEdit}
                />
              </div>
            </div>
          </div>

          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("bio")}
            onKeyDown={(e) => handleRowKey(e, "bio")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">Bio</div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditBio
                  activeEdit={activeEdit}
                  onEdit={onEdit}
                />
              </div>
            </div>
          </div>

          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("socials")}
            onKeyDown={(e) => handleRowKey(e, "socials")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">Socials</div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditSocials
                  activeEdit={activeEdit}
                  onEdit={onEdit}
                />
              </div>
            </div>
          </div>

          <div
            className={rowClass}
            role="button"
            tabIndex={activeEdit ? -1 : 0}
            onClick={() => handleRowOpen("notifications")}
            onKeyDown={(e) => handleRowKey(e, "notifications")}
            aria-disabled={!!activeEdit}
          >
            <div className="flex flex-wrap">
              <div className="hidden md:block grow-0 shrink-0 basis-[100%] md:basis-[33.33%] py-1 font-semibold text-sm">Notifications</div>
              <div className="grow-0 shrink-0 basis-[100%] md:basis-[66.66%]">
                <EditNotifications
                  activeEdit={activeEdit}
                  onEdit={onEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsSection;
