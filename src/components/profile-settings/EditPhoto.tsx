import React, { useEffect, useRef, useState } from 'react';
import { UserRound, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from "@/services/profileService";
import { normalizeImagePath } from "@/utils/normalizeImagePath"; 

interface EditPhotoProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditPhoto: React.FC<EditPhotoProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved photo from backend
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);

  // file input
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------------------------------------
  // 🔥 Load profile on mount → prefill savedPhoto
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadProfile() {
      const { data } = await getProfile();
      if (data?.profile_photo) {
        setSavedPhoto(data.profile_photo);
        setPreviewUrl(data.profile_photo);
      }
    }
    loadProfile();
  }, []);

  // When edit opens, reset values
  useEffect(() => {
    if (activeEdit === "photo") {
      setPreviewUrl(savedPhoto);
      setSelectedPhoto(null);
    }
  }, [activeEdit, savedPhoto]);

  // close edit when clicking outside
  useEffect(() => {
    if (activeEdit !== "photo") return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (formRef.current && !formRef.current.contains(target!)) {
        onEdit(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeEdit, onEdit]);

  const openEdit = () => {
    if (!activeEdit) onEdit("photo");
  };

  // ------------------------------------------------------------
  // Upload and preview
  // ------------------------------------------------------------
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
    setShowPreviewModal(false);
    onEdit(null);
  };

  // ------------------------------------------------------------
  // 🔥 Save photo → send PATCH /profile
  // ------------------------------------------------------------
  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedPhoto) return;

    const res = await updateProfile({ photo: selectedPhoto });

    if (res?.status === 200) {
      toast.success("Photo updated");

      // backend returns updated URL — fetch again or use patch response
      const { data } = await getProfile();

      setSavedPhoto(data?.profile_photo || null);
      setPreviewUrl(data?.profile_photo || null);

      onEdit(null);
      setShowPreviewModal(false);
    } else {
      toast.error(res?.message || "Failed to update photo");
    }
  };

  // modal preview
  const handlePreviewClick = () => {
    if (previewUrl) setShowPreviewModal(true);
  };

  // Modal: ESC close
  useEffect(() => {
    if (!showPreviewModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPreviewModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showPreviewModal]);

  // ------------------------------------------------------------

  return (
   <div>
    {/* Display block */}
    {activeEdit !== "photo" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Photo</div>
        <div className="flex justify-between items-center">
          <div className='truncate mr-3 flex items-center'>
            {savedPhoto ? (
              <img
                src={normalizeImagePath(savedPhoto)}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E5C9A8] text-sm font-bold text-gray-800">
                <UserRound className='w-4 h-4' />
              </div>
            )}
          </div>

          <div
            onClick={openEdit}
            className={
              `cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
               ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`
            }
            role="button"
            tabIndex={0}
          >
            <span>Edit</span>
          </div>
        </div>
      </div>
    )}

    {/* Edit Form */}
    {activeEdit === "photo" && (
      <>
        <div className="fixed inset-0 bg-transparent z-40" aria-hidden />

        <div
          ref={formRef}
          className='edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm'
        >
          <div className='flex justify-between items-center px-6 pt-5'>
            <div>
              <div className="font-semibold">Photo</div>
              <p className="text-[13px] text-gray-500 mt-1">
                Your photo is used in messaging, commenting, and community posts.
              </p>
            </div>
          </div>

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
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPEG, WEBP up to 5MB.
                </p>
              </div>

              {previewUrl && (
                <div className="mt-3">
                  <img
                    src={previewUrl.startsWith("blob:") ? previewUrl : normalizeImagePath(previewUrl)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover cursor-pointer border border-gray-200"
                    onClick={handlePreviewClick}
                  />
                </div>
              )}

              {/* Modal */}
              {showPreviewModal && previewUrl && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
                  <div className="relative max-w-4xl w-full mx-4" role="dialog">
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="absolute top-3 right-3 z-10 rounded bg-white/90 p-2 hover:bg-white"
                    >
                      Cancel
                    </button>

                    <div className="bg-white rounded-md overflow-hidden">
                      <img src={previewUrl.startsWith("blob:") ? previewUrl : normalizeImagePath(previewUrl)} alt="profile-pic" className="w-full max-h-[80vh] object-contain bg-black"/>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-end flex-wrap gap-2 mt-5'>
                <button
                  onClick={handleDiscard}
                  className='cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200'
                  type="button"
                >
                  Discard
                </button>

                <button
                  className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm 
                    ${selectedPhoto ? 'bg-[#06040E] border border-[#06040E]' : 'bg-gray-300 border-gray-300 pointer-events-none'}`}
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
  );
};

export default EditPhoto;
