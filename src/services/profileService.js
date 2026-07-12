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
    .maybeSingle()

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
    .upsert(
      {
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single()

  // Sync auth metadata so UI components using useAuth() update immediately
  if (!error) {
    const metadataUpdates = {}
    if (updates.full_name !== undefined) metadataUpdates.full_name = updates.full_name
    if (updates.avatar_url !== undefined) metadataUpdates.avatar_url = updates.avatar_url

    if (Object.keys(metadataUpdates).length > 0) {
      await supabase.auth.updateUser({ data: metadataUpdates })
    }
  }

  return { data, error }
}

/**
 * Upload an avatar image for a user.
 * @param {string} userId - The UUID of the user.
 * @param {File} file - The image file to upload.
 * @returns {Promise<{ url: string | null, error: object | null }>}
 */
export async function uploadAvatar(userId, file) {
  if (!userId || !file) return { url: null, error: { message: 'User ID and file are required' } }

  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { 
      upsert: true,
      contentType: file.type
    })

  if (uploadError) {
    console.error('Supabase Storage Upload Error:', uploadError)
    return { url: null, error: uploadError }
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}
