import React, { useEffect, useRef, useState } from 'react';
import { UserRound, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface EditPhotoProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditPhoto: React.FC<EditPhotoProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved photo (shown when not editing)
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);

  // file input
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // modal state for full-size preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // ref for the edit form container to detect outside clicks
  const formRef = useRef<HTMLDivElement | null>(null);

  // when edit opens, reset preview
  useEffect(() => {
    if (activeEdit === "photo") {
      setPreviewUrl(savedPhoto);
      setSelectedPhoto(null);
    }
  }, [activeEdit, savedPhoto]);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "photo") return;

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

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("photo");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setSelectedPhoto(null);
    setPreviewUrl(savedPhoto);
    onEdit && onEdit(null);
    setShowPreviewModal(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedPhoto) return;
    setSavedPhoto(previewUrl);
    onEdit && onEdit(null);
    toast.success("Photo updated");
    setShowPreviewModal(false);
  };

  // open modal when user clicks the preview image
  const handlePreviewClick = () => {
    if (!previewUrl) return;
    setShowPreviewModal(true);
  };

  // close modal on escape or outside click
  useEffect(() => {
    if (!showPreviewModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPreviewModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showPreviewModal]);

  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "photo" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Photo</div>
        <div className="flex justify-between items-center">
          <div className='truncate mr-3 flex items-center'>
            {savedPhoto ? (
              <img
                src={savedPhoto}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E5C9A8] text-sm font-bold text-gray-800">
                <UserRound className='w-4 h-4' />
              </div>
            )}
          </div>

          {/* Edit control */}
          <div
            onClick={openEdit}
            className={
              `cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
               ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (!activeEdit && (e.key === 'Enter' || e.key === ' ')) openEdit(); }}
            aria-disabled={!!activeEdit}
          >
            <span className={activeEdit ? 'text-gray-500' : ''}>Edit</span>
          </div>
        </div>
      </div>
    )}

    {/* Edit Form - shown when editing */}
    {activeEdit === "photo" && (
      <>
        <div
          className="fixed inset-0 bg-transparent z-40"
          onMouseDown={() => onEdit && onEdit(null)}
          aria-hidden
        />

        <div
          ref={formRef}
          className='edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm'
        >
          {/* card header */}
          <div className='flex justify-between items-center px-6 pt-5'>
            <div>
              <div className="font-semibold">Photo</div>
              <p className="text-[13px] text-gray-500 mt-1">
                Your photo is used in messaging, commenting, and community posts.
              </p>
            </div>
          </div>

          {/* card body */}
          <div className='px-6 py-5'>
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label
                  htmlFor="photoUpload"
                  className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {selectedPhoto ? selectedPhoto.name : "Choose image"}
                    </span>
                  </div>
                </label>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPEG, GIF, or WEBP up to 5 MB.
                </p>
              </div>

              {previewUrl && (
                <div className="mt-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover cursor-pointer border border-gray-200"
                    onClick={handlePreviewClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") handlePreviewClick(); }}
                  />
                </div>
              )}

              {/* Full-size preview modal */}
              {showPreviewModal && previewUrl && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
                  <div
                    className="relative max-w-4xl w-full mx-4"
                    role="dialog"
                    aria-modal="true"
                  >
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="absolute top-3 right-3 z-10 rounded bg-white/90 p-2 cursor-pointer hover:bg-white text-sm"
                      aria-label="Close preview"
                    >
                      Cancel
                    </button>

                    <div className="bg-white rounded-md overflow-hidden">
                      <img src={previewUrl} alt="Full preview" className="w-full h-auto max-h-[80vh] object-contain bg-black"/>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-end flex-wrap gap-2 mt-5'>
                <button
                  onClick={handleDiscard}
                  className='cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in'
                  type="button"
                >
                  Discard
                </button>
                <button
                  className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm 
                    ${selectedPhoto ? 'bg-[#06040E] border border-[#06040E]' : 'bg-gray-300 border border-gray-300 pointer-events-none'}`}
                  type="submit"
                  disabled={!selectedPhoto}
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
  )
}

export default EditPhoto;
