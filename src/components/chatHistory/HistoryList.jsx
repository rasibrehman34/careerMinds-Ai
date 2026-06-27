import HistoryCard from './HistoryCard'

export default function HistoryList({ chats, onDelete, onRename }) {
  // Group chats by date
  const groupChats = (chats) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    const groups = {
      'Today': [],
      'Yesterday': [],
      'Last 7 Days': [],
      'Older': []
    }

    chats.forEach(chat => {
      const chatDate = new Date(chat.created_at)
      chatDate.setHours(0, 0, 0, 0)

      if (chatDate.getTime() === today.getTime()) {
        groups['Today'].push(chat)
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(chat)
      } else if (chatDate > lastWeek) {
        groups['Last 7 Days'].push(chat)
      } else {
        groups['Older'].push(chat)
      }
    })

    return groups
  }

  const groupedChats = groupChats(chats)

  return (
    <div className="space-y-8">
      {Object.entries(groupedChats).map(([groupName, groupItems]) => {
        if (groupItems.length === 0) return null
        
        return (
          <div key={groupName}>
            <h3 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {groupName}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupItems.map(chat => (
                <HistoryCard 
                  key={chat.id} 
                  chat={chat} 
                  onDelete={onDelete} 
                  onRename={onRename} 
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
