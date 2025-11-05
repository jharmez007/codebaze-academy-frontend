import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

interface EditBioProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const MAX_LENGTH = 120;

const EditBio: React.FC<EditBioProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved bio (shown when not editing)
  const [savedBio, setSavedBio] = useState("");

  // editable bio field
  const [bio, setBio] = useState(savedBio);

  // ref for the edit form container to detect outside clicks
  const formRef = useRef<HTMLDivElement | null>(null);

  // when edit opens, populate inputs with saved values
  useEffect(() => {
    if (activeEdit === "bio") {
      setBio(savedBio);
    }
  }, [activeEdit, savedBio]);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "bio") return;

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

  const isFormValid = bio.trim().length <= MAX_LENGTH;

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("bio");
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    // reset and close
    setBio(savedBio);
    onEdit && onEdit(null);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setSavedBio(bio.trim());
    onEdit && onEdit(null);
    toast.success("Bio updated");
  };

  const remaining = MAX_LENGTH - bio.length;

  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "bio" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Bio</div>
        <div className="flex justify-between items-center">
          <div className='truncate max-sm:max-w-[180px] mr-3'>
            <span className='text-gray-400'>
              {!savedBio ? 'Describe yourself.' : ''}
            </span>
            <div className='truncate text-wrap'>{savedBio}</div>
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
            onKeyDown={(e) => { if (!activeEdit && (e.key === 'Enter')) openEdit(); }}
            aria-disabled={!!activeEdit}
          >
            <span className={activeEdit ? 'text-gray-500' : ''}>Edit</span>
          </div>
        </div>
      </div>
    )}

    {/* Edit Form - shown when editing */}
    {activeEdit === "bio" && (
      <>
        {/* overlay disables all interaction/hover outside the form */}
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
              <div className="font-semibold">Bio</div>
              <p className="text-[13px] text-gray-500 mt-1">
                Your bio is shared comments and community posts.
              </p>
            </div>
          </div>

          {/* card body */}
          <div className='px-6 py-5'>
            <form onSubmit={handleSave}>
              <div className='mb-3'>
                <textarea
                  id='bio'
                  placeholder="Describe yourself."
                  className='w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500'
                  maxLength={MAX_LENGTH}
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className='text-xs text-gray-400 mt-1'>
                  {remaining} characters remaining
                </p>
              </div>

              <div className='flex justify-end flex-wrap gap-2'>
                <button
                  onClick={handleDiscard}
                  className='cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in'
                  type="button"
                >
                  Discard
                </button>
                <button
                  className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm 
                    ${isFormValid ? 'bg-[#06040E] border border-[#06040E]' : 'bg-gray-300 border border-gray-300 pointer-events-none'}`}
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
  )
}

export default EditBio;
