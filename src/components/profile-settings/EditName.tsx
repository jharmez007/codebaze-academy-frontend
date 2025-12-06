import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from "@/services/profileService";

interface EditNameProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditName: React.FC<EditNameProps> = ({
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

  // 🔥 Fetch user data on mount
  useEffect(() => {
    async function loadProfile() {
      const { data } = await getProfile();
      if (data?.full_name) {
        const parts = data.full_name.trim().split(" ");
        const first = parts.shift() || "";
        const last = parts.join(" ");

        setSavedFirst(first);
        setSavedLast(last);
        setFirstName(first);
        setLastName(last);
      }
    }
    loadProfile();
  }, []);

  // when edit opens, populate inputs with saved values
  useEffect(() => {
    if (activeEdit === "name") {
      setFirstName(savedFirst);
      setLastName(savedLast);
    }
  }, [activeEdit, savedFirst, savedLast]);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "name") return;

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
    if (!activeEdit) onEdit && onEdit("name");
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    // reset inputs and close
    setFirstName(savedFirst);
    setLastName(savedLast);
    onEdit && onEdit(null);
  };

  // 🔥 PATCH request to backend
  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const res = await updateProfile({ full_name: fullName });

    if (res?.status === 200) {
      setSavedFirst(firstName.trim());
      setSavedLast(lastName.trim());
      toast.success("Name updated");
      onEdit && onEdit(null);
    } else {
      toast.error(res?.message || "Failed to update name");
    }
  };

  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "name" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Name</div>
        <div className="flex justify-between items-center">
          <div className='truncate mr-3'>
            <span className='text-gray-400'>
              {(!savedFirst && !savedLast) ? 'Change your name' : ''}
            </span>
            <div className='truncate text-wrap'>{savedFirst} {savedLast}</div>
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

    {/* Edit Form */}
    {activeEdit === "name" && (
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
          <div className='flex justify-between items-center px-6 pt-5'>
            <div>
              <div className="font-semibold ">Name</div>
            </div>
          </div>

          <div className='px-6 py-5'>
            <form onSubmit={handleSave}>
              <div className='flex flex-wrap'>
                <div className="px-1 grow-0 shrink-0 basis-[50%]">
                  <div className='mb-3'>
                    <label className='mb-1' htmlFor='firstname'>
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
                    <label className='mb-1' htmlFor='lastname'>
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
  );
};

export default EditName;
