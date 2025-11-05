import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

interface EditCommunityProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditCommunity: React.FC<EditCommunityProps> = ({
  activeEdit,
  onEdit,
}) => {

  // ref for the edit form container to detect outside clicks
  const formRef = useRef<HTMLDivElement | null>(null);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "community") return;

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


  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "community" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Community</div>
        <div className="flex justify-between items-center">
          <div className='truncate max-sm:max-w-[180px] mr-3'>
            <span className='text-gray-400'>
                You're not a member of the community.{" "}
                <Link
                  href="/not-found"
                  className="underline transition-colors duration-150 hover:text-black"
                >
                  Learn more
                </Link>
            </span>
          </div>

          {/* Edit control - faded and non-interactive when any edit is active */}
          <div
            className={
              `cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
               ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`
            }
            role="button"
            tabIndex={0}
            aria-disabled={!!activeEdit}
          >
            <span className={activeEdit ? 'text-gray-500' : ''}>Edit</span>
          </div>
        </div>
      </div>
    )}
   </div>
  )
}

export default EditCommunity;
