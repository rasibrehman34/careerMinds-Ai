import { useCallback, useEffect, useRef, useState } from 'react'
import ChatHeader from '../components/chat/ChatHeader'
import ChatMessages from '../components/chat/ChatMessages'
import ChatInput from '../components/chat/ChatInput'
import EmptyState from '../components/chat/EmptyState'
import ScrollToBottomButton from '../components/chat/ScrollToBottomButton'
import { useAuth } from '../hooks/useAuth'
import { sendCareerQuestion, generateConversationTitle, generateRoadmapTitle, generateComparisonTitle } from '../services/geminiService'
import { createChatHistory, updateChatMessages } from '../services/chatHistoryService'
import { saveRoadmap, saveComparison } from '../services/roadmapService'

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [savedRoadmapIds, setSavedRoadmapIds] = useState([])
  const [savedComparisonIds, setSavedComparisonIds] = useState([])
  const [saveToast, setSaveToast] = useState(null)

  const containerRef = useRef(null)
  const messagesEndRef = useRef(null)

  const hasMessages = messages.length > 0

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [])

  // Show a brief toast notification
  function showNotification(text, type = 'success') {
    setSaveToast({ text, type })
    setTimeout(() => setSaveToast(null), 3000)
  }

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    // Prepare conversation context (last 10 messages for context window)
    const contextLimit = updatedMessages.slice(-10)
    const context = contextLimit
      .map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`)
      .join('\n')

    // Call Gemini Service
    const response = await sendCareerQuestion(trimmed, context)

    const aiMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.success ? response.message : `Error: ${response.error}`,
      createdAt: response.timestamp || new Date().toISOString(),
      isRoadmap: response.isRoadmap || false,
      roadmapTitle: response.roadmapTitle || null,
      isComparison: response.isComparison || false,
      comparisonTitle: response.comparisonTitle || null,
    }

    const finalMessages = [...updatedMessages, aiMessage]
    setMessages(finalMessages)
    setIsTyping(false)

    // Save to Supabase if authenticated
    if (user) {
      try {
        if (!chatId) {
          const titleResponse = await generateConversationTitle(trimmed)
          const title = titleResponse.success ? titleResponse.message : 'New Career Chat'
          const result = await createChatHistory(user.id, title, finalMessages)
          if (result.data) {
            setChatId(result.data.id)
          }
        } else {
          await updateChatMessages(chatId, finalMessages)
        }
      } catch (err) {
        console.error('Failed to save chat history:', err)
      }
    }
  }

  // Handle saving a roadmap message to Supabase
  async function handleSaveRoadmap(message) {
    if (!user) {
      showNotification('Please sign in to save roadmaps.', 'error')
      return
    }

    if (savedRoadmapIds.includes(message.id)) return

    try {
      // Auto-generate a clean title using Gemini
      const titleResponse = await generateRoadmapTitle(message.roadmapTitle || 'Career Roadmap')
      const title = titleResponse.success ? titleResponse.message : 'Career Roadmap'

      const { error } = await saveRoadmap(user.id, title, message.content)
      if (error) {
        console.error('Save roadmap error:', error)
        showNotification('Failed to save roadmap. Please try again.', 'error')
        return
      }

      setSavedRoadmapIds(prev => [...prev, message.id])
      showNotification(`"${title}" saved to your Saved Careers!`)
    } catch (err) {
      console.error('Unexpected error saving roadmap:', err)
      showNotification('Something went wrong. Please try again.', 'error')
    }
  }

  // Handle saving a comparison message to Supabase
  async function handleSaveComparison(message) {
    if (!user) {
      showNotification('Please sign in to save comparisons.', 'error')
      return
    }
    if (savedComparisonIds.includes(message.id)) return
    try {
      const titleResponse = await generateComparisonTitle(message.comparisonTitle || 'Degree Comparison')
      const title = titleResponse.success ? titleResponse.message : 'Degree Comparison'
      const { error } = await saveComparison(user.id, title, message.content)
      if (error) {
        console.error('Save comparison error:', error)
        showNotification('Failed to save comparison. Please try again.', 'error')
        return
      }
      setSavedComparisonIds(prev => [...prev, message.id])
      showNotification(`"${title}" saved to your Saved Comparisons!`)
    } catch (err) {
      console.error('Unexpected error saving comparison:', err)
      showNotification('Something went wrong. Please try again.', 'error')
    }
  }

  function handleNewChat() {
    setMessages([])
    setInput('')
    setChatId(null)
    setShowScrollButton(false)
    setSavedRoadmapIds([])
    setSavedComparisonIds([])
  }

  function handleSelectQuestion(question) {
    setInput(question)
  }

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    setShowScrollButton(distanceFromBottom > 120)
  }, [])

  useEffect(() => {
    if (hasMessages) {
      scrollToBottom(messages.length === 1 ? 'auto' : 'smooth')
    }
  }, [messages, hasMessages, scrollToBottom])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasMessages) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [hasMessages, handleScroll])

  return (
    <section className="flex min-h-[calc(100dvh-4.5rem)] flex-1 flex-col bg-stone-50 dark:bg-zinc-950">
      <ChatHeader onNewChat={handleNewChat} />

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden">
        {hasMessages ? (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            containerRef={containerRef}
            messagesEndRef={messagesEndRef}
            onSaveRoadmap={handleSaveRoadmap}
            onSaveComparison={handleSaveComparison}
            savedRoadmapIds={savedRoadmapIds}
            savedComparisonIds={savedComparisonIds}
          />
        ) : (
          <EmptyState onSelectQuestion={handleSelectQuestion} />
        )}

        <ScrollToBottomButton
          visible={hasMessages && showScrollButton}
          onClick={() => scrollToBottom()}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isTyping}
        />
      </div>

      {/* Toast notification */}
      {saveToast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            saveToast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-700 text-white'
          }`}
        >
          {saveToast.text}
        </div>
      )}
    </section>
  )
}
