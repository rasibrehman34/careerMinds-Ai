import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, MessageSquare, Trash2, Edit2, ChevronRight, Check, X } from 'lucide-react'

export default function HistoryCard({ chat, onDelete, onRename }) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chat.title)
  const menuRef = useRef(null)
  
  // Format date
  const dateStr = new Date(chat.created_at).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  })

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRenameSubmit = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(chat.id, editTitle.trim())
    } else {
      setEditTitle(chat.title) // reset
    }
    setIsEditing(false)
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700">
      
      {/* Menu button */}
      <div className="absolute right-4 top-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault()
            setShowMenu(!showMenu)
          }}
          className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 focus:outline-none"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        
        {/* Dropdown */}
        {showMenu && (
          <div className="absolute right-0 top-8 z-10 w-40 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(false)
                  setIsEditing(true)
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
              >
                <Edit2 className="mr-3 h-4 w-4" />
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(false)
                  onDelete(chat)
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-3 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <Link to={`/chat/${chat.id}`} className="block flex-1 pr-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={e => e.preventDefault()}>
                <input
                  type="text"
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit()
                    if (e.key === 'Escape') {
                      setIsEditing(false)
                      setEditTitle(chat.title)
                    }
                  }}
                  className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={handleRenameSubmit} className="text-green-600 hover:text-green-700 dark:text-green-400">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => { setIsEditing(false); setEditTitle(chat.title) }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <h3 className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                {chat.title}
              </h3>
            )}
            
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 min-h-[2.5rem]">
              {chat.first_message || "Empty conversation"}
            </p>
          </div>
        </div>
      </Link>
      
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {dateStr}
        </span>
        <Link 
          to={`/chat/${chat.id}`}
          className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group-hover:underline"
        >
          Open Chat
          <ChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
