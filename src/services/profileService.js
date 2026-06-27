import { supabase } from '../supabase/supabaseClient'

/**
 * Fetch the profile for a given user ID.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function getProfile(userId) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

/**
 * Update the profile for a given user ID.
 * @param {string} userId - The UUID of the user.
 * @param {object} updates - An object containing the fields to update.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function updateProfile(userId, updates) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}
