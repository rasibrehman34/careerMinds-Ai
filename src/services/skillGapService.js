import { supabase } from '../supabase/supabaseClient'

/**
 * Skill Gap Service
 * Handles all Supabase operations for saved skill gap analysis reports.
 */

/**
 * Save a skill gap report for a user.
 * @param {string} userId
 * @param {string} career - The target career the user entered.
 * @param {string} currentSkills - Comma-separated or newline-separated skills.
 * @param {string} analysis - The full markdown analysis from Gemini.
 */
export async function saveReport(userId, career, currentSkills, analysis) {
  try {
    if (!userId) return { data: null, error: { message: 'User ID is required' } }

    const { data, error } = await supabase
      .from('skill_gap_reports')
      .insert([{ user_id: userId, career, current_skills: currentSkills, analysis }])
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [saveReport]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [saveReport]:', err)
    return { data: null, error: err }
  }
}

/**
 * Fetch all saved skill gap reports for a user, ordered by newest first.
 * @param {string} userId
 * @param {number} limit - Optional max records to return.
 */
export async function getReports(userId, limit = 50) {
  try {
    if (!userId) return { data: null, error: { message: 'User ID is required' } }

    const { data, error } = await supabase
      .from('skill_gap_reports')
      .select('id, career, current_skills, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Supabase Error [getReports]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [getReports]:', err)
    return { data: null, error: err }
  }
}

/**
 * Fetch the full analysis content for a single report.
 * @param {string} reportId
 */
export async function getReportById(reportId) {
  try {
    const { data, error } = await supabase
      .from('skill_gap_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) {
      console.error('Supabase Error [getReportById]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [getReportById]:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete a skill gap report.
 * @param {string} reportId
 */
export async function deleteReport(reportId) {
  try {
    const { error } = await supabase
      .from('skill_gap_reports')
      .delete()
      .eq('id', reportId)

    if (error) {
      console.error('Supabase Error [deleteReport]:', error)
    }

    return { error }
  } catch (err) {
    console.error('Unexpected Error [deleteReport]:', err)
    return { error: err }
  }
}
