import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

interface EditSessionsProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditSessions: React.FC<EditSessionsProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved values shown when not editing
  const [savedFirst, setSavedFirst] = useState("");
  const [savedLast, setSavedLast] = useState("");

  // form inputs
  const [firstName, setFirstName] = useState(savedFirst);
  const [lastName, setLastName] = useState(savedLast);

  // ref for the edit form container to detect outside clicks
  const formRef = useRef<HTMLDivElement | null>(null);

  // when edit opens, populate inputs with saved values
  useEffect(() => {
    if (activeEdit === "sessions") {
      setFirstName(savedFirst);
      setLastName(savedLast);
    }
  }, [activeEdit, savedFirst, savedLast]);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "sessions") return;

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

  const isFormValid = firstName.trim() !== "" && lastName.trim() !== "";

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("sessions");
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    // reset inputs and close
    setFirstName(savedFirst);
    setLastName(savedLast);
    onEdit && onEdit(null);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setSavedFirst(firstName.trim());
    setSavedLast(lastName.trim());
    onEdit && onEdit(null);
    toast.success("Name updated");
  };

  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "sessions" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Sessions</div>
        <div className="flex justify-between items-center">
          <div className='truncate mr-3'>
            <span className='text-gray-400'>
              {(!savedFirst && !savedLast) ? 'No active sessions' : ''}
            </span>
            <div className='truncate text-wrap'>{savedFirst} {savedLast}</div>
          </div>

          {/* Edit control - faded and non-interactive when any edit is active */}
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
    {activeEdit === "sessions" && (
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
              <div className="font-semibold ">Name</div>
            </div>
          </div>

          {/* card body */}
          <div className='px-6 py-5'>
            <form onSubmit={handleSave}>
              <div className='flex flex-wrap'>
                <div className="px-1 grow-0 shrink-0 basis-[50%]">
                  <div className='mb-3'>
                    <label 
                      className='mb-1' 
                      htmlFor='firstname'
                    >
                        First name
                    </label>
                    <input 
                      id='firstname'
                      type="text"
                      placeholder="e.g. Agu"
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="px-1 grow-0 shrink-0 basis-[50%]">
                  <div className='mb-3'>
                    <label 
                      className='mb-1' 
                      htmlFor='lastname'
                    >
                        Last name
                    </label>
                    <input 
                      id='lastname'
                      type="text"
                      placeholder="e.g. James"
                      className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
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

export default EditSessions;
