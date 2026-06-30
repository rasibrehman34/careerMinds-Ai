-- Skill Gap Reports Table
-- Run this in your Supabase SQL Editor

CREATE TABLE skill_gap_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  career text NOT NULL,
  current_skills text NOT NULL,
  analysis text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE skill_gap_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own skill gap reports." ON skill_gap_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skill gap reports." ON skill_gap_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skill gap reports." ON skill_gap_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_skill_gap_reports_user_id ON skill_gap_reports(user_id);
