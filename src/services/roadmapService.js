import { supabase } from '../supabase/supabaseClient'

/**
 * Roadmap Service
 * Handles all Supabase operations for saved career roadmaps and degree comparisons.
 * Both feature types share the same `saved_roadmaps` table, differentiated by a `type` column.
 */

/**
 * Fetch all saved roadmaps for a user.
 * @param {string} userId - The UUID of the authenticated user.
 * @returns {Promise<{ data: Array | null, error: object | null }>}
 */
export async function getSavedRoadmaps(userId) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('saved_roadmaps')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'roadmap')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Save a career roadmap for a user.
 * @param {string} userId - The UUID of the authenticated user.
 * @param {string} title - A short title for the roadmap.
 * @param {string} content - The full markdown content of the roadmap.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function saveRoadmap(userId, title, content) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('saved_roadmaps')
    .insert([{ user_id: userId, title, content, type: 'roadmap' }])
    .select()
    .single()

  return { data, error }
}

/**
 * Delete a saved roadmap or comparison.
 * @param {string} roadmapId - The UUID of the record to delete.
 * @returns {Promise<{ error: object | null }>}
 */
export async function deleteRoadmap(roadmapId) {
  const { error } = await supabase
    .from('saved_roadmaps')
    .delete()
    .eq('id', roadmapId)

  return { error }
}

/**
 * Fetch all saved degree comparisons for a user.
 * @param {string} userId - The UUID of the authenticated user.
 * @returns {Promise<{ data: Array | null, error: object | null }>}
 */
export async function getSavedComparisons(userId) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('saved_roadmaps')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'comparison')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Save a degree comparison for a user.
 * @param {string} userId - The UUID of the authenticated user.
 * @param {string} title - A short title for the comparison.
 * @param {string} content - The full markdown content of the comparison.
 * @returns {Promise<{ data: object | null, error: object | null }>}
 */
export async function saveComparison(userId, title, content) {
  if (!userId) return { data: null, error: { message: 'User ID is required' } }

  const { data, error } = await supabase
    .from('saved_roadmaps')
    .insert([{ user_id: userId, title, content, type: 'comparison' }])
    .select()
    .single()

  return { data, error }
}
