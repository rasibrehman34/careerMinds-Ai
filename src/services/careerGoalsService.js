import { supabase } from '../supabase/supabaseClient'

/**
 * Fetch all career goals for a user.
 */
export async function getGoals(userId) {
  try {
    if (!userId) return { data: null, error: { message: 'User ID is required' } }

    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase Error [getGoals]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [getGoals]:', err)
    return { data: null, error: err }
  }
}

/**
 * Create a new career goal.
 */
export async function createGoal(userId, title) {
  try {
    const { data, error } = await supabase
      .from('career_goals')
      .insert([
        { user_id: userId, title, status: 'Not Started' }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [createGoal]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [createGoal]:', err)
    return { data: null, error: err }
  }
}

/**
 * Update an existing career goal.
 */
export async function updateGoal(goalId, updates) {
  try {
    const { data, error } = await supabase
      .from('career_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', goalId)
      .select()
      .single()

    if (error) {
      console.error('Supabase Error [updateGoal]:', error)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected Error [updateGoal]:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete a career goal.
 */
export async function deleteGoal(goalId) {
  try {
    const { error } = await supabase
      .from('career_goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      console.error('Supabase Error [deleteGoal]:', error)
    }

    return { error }
  } catch (err) {
    console.error('Unexpected Error [deleteGoal]:', err)
    return { error: err }
  }
}
