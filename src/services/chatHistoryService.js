import { supabase } from '../supabase/supabaseClient'

/**
 * Fetch chat history (conversations) for a specific user, including a preview of the last message and message count.
 */
export async function getChatHistory(userId, limit = 50) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      title,
      created_at,
      updated_at,
      messages ( id, content, created_at )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) return { data: null, error }

  // Format to provide message count and preview
  const formattedData = data.map(conv => {
    // sort messages for this conversation by created_at desc
    const sortedMessages = (conv.messages || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const lastMessage = sortedMessages.length > 0 ? sortedMessages[0].content : '';
    return {
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      message_count: conv.messages ? conv.messages.length : 0,
      first_message: lastMessage // reuse this key for preview purposes
    }
  })

  return { data: formattedData, error: null }
}

/**
 * Fetch all messages for a specific conversation.
 */
export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return { data, error }
}

/**
 * Create a new conversation for a user.
 */
export async function createConversation(userId, title) {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      { user_id: userId, title }
    ])
    .select()
    .single()

  return { data, error }
}

/**
 * Add a message to a conversation.
 */
export async function addMessage(conversationId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { conversation_id: conversationId, role, content }
    ])
    .select()
    .single()

  // Update conversation's updated_at
  if (!error) {
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
  }

  return { data, error }
}

/**
 * Update a conversation's title.
 */
export async function updateChatTitle(chatId, newTitle) {
  const { data, error } = await supabase
    .from('conversations')
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq('id', chatId)
    .select()
    .single()

  return { data, error }
}

/**
 * Delete a conversation.
 */
export async function deleteChatHistory(chatId) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', chatId)

  return { error }
}
