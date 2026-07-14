-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This creates the `delete_user` RPC function that the frontend calls to delete the current user.

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the currently authenticated user from auth.users
  -- This cascades to all related data if you have ON DELETE CASCADE on foreign keys
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users only
REVOKE ALL ON FUNCTION public.delete_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

