import { supabase } from '../supabase/supabaseClient'

/**
 * Fetch chat history for a specific user.
 * @param {string} userId - The UUID of the user.
 * @param {number} limit - Maximum number of records to fetch.
 * @returns {Promise<{ data: array | null, error: object | null }>}
 */
export async function getChatHistory(userId, limit = 50) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Create a new chat session for a user.
 * @param {string} userId - The UUID of the user.
 * @param {string} title - The title of the chat.
 * @param {Array} messages - Initial messages.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function createChatHistory(userId, title, messages = []) {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([
      { user_id: userId, title, messages }
    ])
    .select()
    .single()

  return { data, error }
}

/**
 * Append messages to an existing chat history record.
 * @param {string} chatId - The UUID of the chat.
 * @param {Array} newMessages - The messages array.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function updateChatMessages(chatId, newMessages) {
  const { data, error } = await supabase
    .from('chat_history')
    .update({ messages: newMessages, updated_at: new Date().toISOString() })
    .eq('id', chatId)
    .select()
    .single()

  return { data, error }
}

/**
 * Update a chat's title.
 * @param {string} chatId - The UUID of the chat.
 * @param {string} newTitle - The new title.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function updateChatTitle(chatId, newTitle) {
  const { data, error } = await supabase
    .from('chat_history')
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq('id', chatId)
    .select()
    .single()

  return { data, error }
}

/**
 * Delete a chat history record.
 * @param {string} chatId - The UUID of the chat.
 * @returns {Promise<{ error: object | null }>}
 */
export async function deleteChatHistory(chatId) {
  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('id', chatId)

  return { error }
}
