import { supabase } from '../supabase/supabaseClient'

/**
 * Fetches the career profile for a given user.
 * @param {string} userId - The Supabase Auth user ID.
 * @returns {Promise<Object>} The career profile data or an error object.
 */
export async function getCareerProfile(userId) {
  if (!userId) return { data: null, error: 'User ID is required' }

  try {
    const { data, error } = await supabase
      .from('career_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
      console.error('Error fetching career profile:', error.message)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching career profile:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Upserts (inserts or updates) the career profile for a user.
 * @param {string} userId - The Supabase Auth user ID.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} The updated data or an error object.
 */
export async function upsertCareerProfile(userId, profileData) {
  if (!userId) return { data: null, error: 'User ID is required' }

  try {
    const { data, error } = await supabase
      .from('career_profiles')
      .upsert({ user_id: userId, ...profileData }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting career profile:', error.message)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error upserting career profile:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Calculates the completion percentage of a career profile.
 * @param {Object} profile - The career profile data.
 * @returns {number} Completion percentage (0-100).
 */
export function calculateProfileCompletion(profile) {
  if (!profile) return 0

  const fieldsToCheck = [
    'education', // covers degree/semester
    'career_goal',
    'current_skills',
    'interests',
    'preferred_work',
    'current_learning'
  ]

  let filledCount = 0

  fieldsToCheck.forEach(field => {
    const value = profile[field]
    if (Array.isArray(value)) {
      if (value.length > 0) filledCount++
    } else if (value && typeof value === 'string' && value.trim().length > 0) {
      filledCount++
    }
  })

  return Math.round((filledCount / fieldsToCheck.length) * 100)
}
