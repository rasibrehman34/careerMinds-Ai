import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import HistoryList from '../components/chatHistory/HistoryList'
import HistorySearch from '../components/chatHistory/HistorySearch'
import HistoryFilter from '../components/chatHistory/HistoryFilter'
import EmptyHistory from '../components/chatHistory/EmptyHistory'
import LoadingHistory from '../components/chatHistory/LoadingHistory'
import DeleteDialog from '../components/chatHistory/DeleteDialog'
import { getChatHistory, deleteChatHistory, updateChatTitle } from '../services/chatHistoryService'
import { useAuth } from '../hooks/useAuth'

export default function ChatHistory() {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('newest')
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState(null)

  useEffect(() => {
    async function loadHistory() {
      if (user?.id) {
        setLoading(true)
        const { data } = await getChatHistory(user.id)
        if (data) setChats(data)
        setLoading(false)
      }
    }
    loadHistory()
  }, [user])

  // Filter and sort the chats
  const filteredAndSortedChats = useMemo(() => {
    let result = [...chats]

    // Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        chat => 
          chat.title.toLowerCase().includes(query) || 
          (chat.first_message && chat.first_message.toLowerCase().includes(query))
      )
    }

    // Apply Sort
    if (filter === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (filter === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (filter === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [chats, searchQuery, filter])

  const handleDeleteClick = (chat) => {
    setChatToDelete(chat)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      // Soft delete from UI immediately
      setChats(prev => prev.filter(c => c.id !== chatToDelete.id))
      setDeleteModalOpen(false)
      
      // Delete from Supabase
      await deleteChatHistory(chatToDelete.id)
      setChatToDelete(null)
    }
  }

  const handleRename = async (chatId, newTitle) => {
    // Optimistic UI update
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c))
    
    // Update Supabase
    await updateChatTitle(chatId, newTitle)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Chat History
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Review and manage your past career conversations.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <HistorySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <HistoryFilter filter={filter} setFilter={setFilter} />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingHistory count={6} />
        ) : chats.length === 0 && !searchQuery ? (
          <EmptyHistory />
        ) : filteredAndSortedChats.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
            No conversations match your search.
          </div>
        ) : (
          <HistoryList 
            chats={filteredAndSortedChats} 
            onDelete={handleDeleteClick} 
            onRename={handleRename}
          />
        )}
      </div>

      <DeleteDialog 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={chatToDelete?.title || ''}
      />
    </DashboardLayout>
  )
}
