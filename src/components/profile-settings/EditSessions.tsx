import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Monitor, Smartphone, X } from 'lucide-react'

interface EditSessionsProps {
  activeEdit: string | null
  onEdit: (key: string | null) => void
}

interface Session {
  id: number
  device: string
  date: string
}

const EditSessions: React.FC<EditSessionsProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved sessions (displayed when not editing)
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, device: "Chrome on Windows 10", date: "Nov 2 at 3:23 PM EST" },
    { id: 2, device: "Chrome on Android", date: "Nov 2 at 3:23 PM EST" },
  ])

  const formRef = useRef<HTMLDivElement | null>(null)

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "sessions") return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!formRef.current) return
      if (target && !formRef.current.contains(target)) {
        onEdit && onEdit(null)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [activeEdit, onEdit])

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("sessions")
  }

  const handleRemove = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast.success("Session removed")
  }

  // helper: pick correct icon for device
  const getDeviceIcon = (device: string) => {
    if (/android|iphone|mobile/i.test(device)) return <Smartphone className="w-5 h-5 text-gray-600" />
    return <Monitor className="w-5 h-5 text-gray-600" />
  }

  return (
    <div>
      {/* Display block - hidden when editing */}
      {activeEdit !== "sessions" && (
        <div className='text-sm max-sm:px-6'>
          <div className="block md:hidden font-semibold">Sessions</div>
          <div className="flex justify-between items-center">
            <div className='truncate mr-3'>
              <span className={sessions.length === 0 ? 'text-gray-400' : 'text-black'}>
                {sessions.length === 0
                  ? 'No active sessions'
                  : `${sessions.length} active session${sessions.length > 1 ? 's' : ''}`}
              </span>
            </div>

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
          <div
            className="fixed inset-0 bg-transparent z-40"
            onMouseDown={() => onEdit && onEdit(null)}
            aria-hidden
          />

          <div
            ref={formRef}
            className='edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm p-6'
          >
            <div className="font-semibold mb-3">Manage verified sessions</div>
            <p className="text-gray-500 text-[13px] mb-5 leading-5">
              Each time you login to your account, a verification code is emailed to you to proceed.
              You may have up to 5 login sessions verified at any given time, each of which expire after 30 days.
              Logging into a 6th session will logout the oldest session.
            </p>

            <div className="border rounded-md">
              {sessions.length === 0 ? (
                <div className="p-4 text-gray-400 text-sm">No active sessions</div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center px-4 py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.device)}
                      <div>
                        <div className="font-medium">{session.device}</div>
                        <div className="text-xs text-gray-500">{session.date}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(session.id)}
                      className="text-gray-600 hover:text-red-500 text-lg  font-semibold"
                      aria-label="Remove session"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => onEdit && onEdit(null)}
                className='cursor-pointer bg-gray-900 text-white rounded-md py-1 px-4 text-sm hover:bg-black transition ease-in'
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EditSessions
