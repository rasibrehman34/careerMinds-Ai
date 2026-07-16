import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatHeader from '../components/chat/ChatHeader'
import ChatMessages from '../components/chat/ChatMessages'
import ChatInput from '../components/chat/ChatInput'
import EmptyState from '../components/chat/EmptyState'
import ScrollToBottomButton from '../components/chat/ScrollToBottomButton'
import { useAuth } from '../hooks/useAuth'
import { sendCareerQuestion, generateConversationTitle, generateRoadmapTitle, generateComparisonTitle } from '../services/AI/AIService'
import { createConversation, addMessage, getMessages } from '../services/chatHistoryService'
import { saveRoadmap, saveComparison } from '../services/roadmapService'
import { getCareerProfile, upsertCareerProfile } from '../services/careerProfileService'
import DashboardLayout from '../components/dashboard/DashboardLayout'

export default function Chat() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [chatId, setChatId] = useState(id || null)
  const [savedRoadmapIds, setSavedRoadmapIds] = useState([])
  const [savedComparisonIds, setSavedComparisonIds] = useState([])
  const [savedResponseIds, setSavedResponseIds] = useState([])
  const [saveToast, setSaveToast] = useState(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [careerProfile, setCareerProfile] = useState(null)

  const containerRef = useRef(null)
  const messagesEndRef = useRef(null)

  const hasMessages = messages.length > 0

  // Load chat history if ID is present
  useEffect(() => {
    async function loadChat() {
      if (user) {
        const { data: profileData } = await getCareerProfile(user.id)
        setCareerProfile(profileData || null)
      }
      
      if (id && user) {
        setIsLoadingHistory(true)
        const { data } = await getMessages(id)
        if (data) {
          // Format messages from DB to match UI expectation
          const formattedMessages = data.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at
          }))
          setMessages(formattedMessages)
          setChatId(id)
        }
        setIsLoadingHistory(false)
      } else if (!id) {
        setMessages([])
        setChatId(null)
      }
    }
    loadChat()
  }, [id, user])

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

    let currentChatId = chatId

    // Save user message to Supabase if authenticated
    if (user) {
      try {
        if (!currentChatId) {
          const titleResponse = await generateConversationTitle(trimmed)
          const title = titleResponse.success ? titleResponse.message : 'New Career Chat'
          const result = await createConversation(user.id, title)
          if (result.error) {
            console.error('Failed to create conversation:', result.error)
          } else if (result.data) {
            currentChatId = result.data.id
            setChatId(currentChatId)
            // Save user message to the new conversation
            const msgResult = await addMessage(currentChatId, 'user', trimmed)
            if (msgResult.error) {
              console.error('Failed to save initial user message:', msgResult.error)
            }
            // Update URL without reloading page
            navigate(`/chat/${currentChatId}`, { replace: true })
          }
        } else {
          const msgResult = await addMessage(currentChatId, 'user', trimmed)
          if (msgResult.error) {
            console.error('Failed to save user message:', msgResult.error)
          }
        }
      } catch (err) {
        console.error('Unexpected error saving user message:', err)
      }
    }

    // Prepare conversation context (last 10 messages for context window)
    const contextLimit = messages.slice(-10)
    const context = contextLimit
      .map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`)
      .join('\n')

    // Call Gemini Service
    const response = await sendCareerQuestion(trimmed, context, careerProfile)

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

    // Save AI response to Supabase if authenticated
    if (user && currentChatId) {
      try {
        const aiMsgResult = await addMessage(currentChatId, 'assistant', aiMessage.content)
        if (aiMsgResult.error) {
          console.error('Failed to save AI response:', aiMsgResult.error)
        }
      } catch (err) {
        console.error('Unexpected error saving AI response:', err)
      }
    }
  }

  async function handleSaveProfile(proposal, messageId) {
    if (!user) {
      showNotification('Please sign in to update your profile.', 'error')
      return
    }
    try {
      const field = proposal.field
      const value = proposal.value
      const currentProfile = careerProfile || {}
      let updatedProfile = { ...currentProfile }
      
      if (Array.isArray(updatedProfile[field])) {
        if (!updatedProfile[field].includes(value)) {
          updatedProfile[field] = [...updatedProfile[field], value]
        }
      } else {
        updatedProfile[field] = value
      }

      const { data, error } = await upsertCareerProfile(user.id, updatedProfile)
      if (error) throw error
      
      setCareerProfile(data)
      showNotification('Career Profile updated successfully!')
      
      // Update message to hide buttons
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, profileProposalHandled: true } : m))
    } catch (err) {
      console.error('Failed to update profile:', err)
      showNotification('Failed to update profile.', 'error')
    }
  }

  function handleDismissProfile(messageId) {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, profileProposalHandled: true } : m))
  }

  // Handle saving a roadmap message to Supabase
  async function handleSaveRoadmap(message) {
    if (!user) {
      showNotification('Please sign in to save roadmaps.', 'error')
      return
    }

    if (savedRoadmapIds.includes(message.id)) return

    try {
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

  // Handle saving a general AI response to Supabase
  async function handleSaveResponse(message) {
    if (!user) {
      showNotification('Please sign in to save responses.', 'error')
      return
    }

    if (savedResponseIds.includes(message.id)) return

    try {
      const titleSource = message.content.slice(0, 200)
      const titleResponse = await generateConversationTitle(titleSource)
      const title = titleResponse.success ? titleResponse.message : 'Saved Career Advice'

      const { error } = await saveRoadmap(user.id, title, message.content)
      if (error) {
        console.error('Save response error:', error)
        showNotification('Failed to save response. Please try again.', 'error')
        return
      }

      setSavedResponseIds(prev => [...prev, message.id])
      showNotification(`"${title}" saved to your Saved Careers!`)
    } catch (err) {
      console.error('Unexpected error saving response:', err)
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
    setSavedResponseIds([])
    navigate('/chat')
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

  const chatContent = (
    <section className="flex flex-1 h-full flex-col bg-stone-50 dark:bg-zinc-950">
      {user ? (
        <ChatHeader onNewChat={handleNewChat} />
      ) : hasMessages ? (
        <div className="border-b border-stone-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6">
          <div className="mx-auto flex max-w-4xl justify-end">
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              New chat
            </button>
          </div>
        </div>
      ) : null}

      {!user && (
        <div className="bg-blue-50 py-2 text-center text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Sign in to save your conversation history.
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden">
        {isLoadingHistory ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
          </div>
        ) : hasMessages ? (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            containerRef={containerRef}
            messagesEndRef={messagesEndRef}
            onSaveRoadmap={handleSaveRoadmap}
            onSaveComparison={handleSaveComparison}
            onSaveResponse={handleSaveResponse}
            onSaveProfile={handleSaveProfile}
            onDismissProfile={handleDismissProfile}
            savedRoadmapIds={savedRoadmapIds}
            savedComparisonIds={savedComparisonIds}
            savedResponseIds={savedResponseIds}
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
          disabled={isTyping || isLoadingHistory}
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

  if (user) {
    return (
      <DashboardLayout noPadding>
        {chatContent}
      </DashboardLayout>
    )
  }

  return chatContent
}
