import { supabase } from '../supabase/supabaseClient'

/**
 * Fetch chat history (conversations) for a specific user, including a preview of the last message and message count.
 */
export async function getChatHistory(userId, limit = 50) {
  try {
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

    if (error) {
      console.error('Supabase Error [getChatHistory]:', error)
      return { data: null, error }
    }

    // Format to provide message count and preview
    const formattedData = data.map(conv => {
      // sort messages for this conversation by created_at desc (newest first)
      const sortedMessages = (conv.messages || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const lastMessage = sortedMessages.length > 0 ? sortedMessages[0].content : '';
      return {
        id: conv.id,
        title: conv.title,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        message_count: conv.messages ? conv.messages.length : 0,
        last_message: lastMessage 
      }
    })

    return { data: formattedData, error: null }
  } catch (err) {
    console.error('Unexpected Error [getChatHistory]:', err)
    return { data: null, error: err }
  }
}

/**
 * Fetch all messages for a specific conversation.
 */
export async function getMessages(conversationId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase Error [getMessages]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [getMessages]:', err)
    return { data: null, error: err }
  }
}

/**
 * Create a new conversation for a user.
 */
export async function createConversation(userId, title) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        { user_id: userId, title }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [createConversation]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [createConversation]:', err)
    return { data: null, error: err }
  }
}

/**
 * Add a message to a conversation.
 */
export async function addMessage(conversationId, role, content) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { conversation_id: conversationId, role, content }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [addMessage insert]:', error)
      return { data, error }
    }

    // Update conversation's updated_at
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    if (updateError) {
      console.error('Supabase Error [addMessage update conversation]:', updateError)
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected Error [addMessage]:', err)
    return { data: null, error: err }
  }
}

/**
 * Update a conversation's title.
 */
export async function updateChatTitle(chatId, newTitle) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', chatId)
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [updateChatTitle]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [updateChatTitle]:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete a conversation.
 */
export async function deleteChatHistory(chatId) {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', chatId)

    if (error) {
      console.error('Supabase Error [deleteChatHistory]:', error)
    }

    return { error }
  } catch (err) {
    console.error('Unexpected Error [deleteChatHistory]:', err)
    return { error: err }
  }
}
