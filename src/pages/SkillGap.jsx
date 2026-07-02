import { useState, useEffect } from 'react'
import { BrainCircuit, Loader, Save, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import { generateSkillGapAnalysis } from '../services/geminiService'
import { saveReport, getReports, getReportById, deleteReport } from '../services/skillGapService'

const EDUCATION_OPTIONS = ['', 'High School / Matric', 'Intermediate / FSc', "Bachelor's Degree", "Master's Degree", 'Self-Taught / Bootcamp', 'Other']
const EXPERIENCE_OPTIONS = ['', 'No Experience (Complete Beginner)', 'Less than 1 Year', '1–2 Years', '3–5 Years', '5+ Years']

// Lightweight markdown renderer using native HTML — avoids extra library dependency
function ReportSection({ content }) {
  const lines = content.split('\n')
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-h3:text-base prose-p:text-sm prose-li:text-sm prose-ul:mt-1 prose-ol:mt-1">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="mt-6 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{line.replace('### ', '')}</h3>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="mt-6 mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{line.replace('## ', '')}</h2>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={i} className="ml-4 text-sm text-zinc-700 dark:text-zinc-300">{line.replace(/^[-*] /, '')}</li>
        }
        if (/^\d+\. /.test(line)) {
          return <li key={i} className="ml-4 list-decimal text-sm text-zinc-700 dark:text-zinc-300">{line.replace(/^\d+\. /, '')}</li>
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.trim() === '') return <br key={i} />
        return <p key={i} className="text-sm text-zinc-700 dark:text-zinc-300">{line}</p>
      })}
    </div>
  )
}

// Collapsible section for long reports
function CollapsibleReport({ content }) {
  const [expanded, setExpanded] = useState(false)
  const preview = content.split('\n').slice(0, 15).join('\n')
  const isLong = content.split('\n').length > 15

  return (
    <div>
      <ReportSection content={expanded || !isLong ? content : preview} />
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          aria-expanded={expanded}
        >
          {expanded ? (
            <><ChevronUp className="h-4 w-4" /> Show less</>
          ) : (
            <><ChevronDown className="h-4 w-4" /> Show full report</>
          )}
        </button>
      )}
    </div>
  )
}

export default function SkillGap() {
  const { user } = useAuth()
  const location = useLocation()

  // Form state
  const [career, setCareer] = useState('')
  const [skills, setSkills] = useState('')
  const [education, setEducation] = useState('')
  const [experience, setExperience] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)

  // Saved reports
  const [savedReports, setSavedReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  function showToast(text, type = 'success') {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Fetch saved reports list
  async function fetchSavedReports() {
    if (!user?.id) return
    setReportsLoading(true)
    const { data } = await getReports(user.id)
    if (data) setSavedReports(data)
    setReportsLoading(false)
  }

  useEffect(() => {
    fetchSavedReports()
  }, [user])

  // Auto-load report if navigated here with a reportId in location state
  useEffect(() => {
    const reportId = location.state?.reportId
    if (reportId && user?.id) {
      handleLoadReport(reportId)
    }
  }, [location.state, user])

  async function handleLoadReport(reportId) {
    setReportLoading(true)
    setReport(null)
    setSaved(true)
    setSelectedReport(reportId)
    const { data, error: fetchError } = await getReportById(reportId)
    if (fetchError || !data) {
      showToast('Failed to load report.', 'error')
    } else {
      setCareer(data.career || '')
      setSkills(data.current_skills || '')
      setReport(data.analysis)
    }
    setReportLoading(false)
    // Scroll to report area
    setTimeout(() => {
      document.getElementById('report-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  async function handleDeleteReport(reportId, e) {
    e.stopPropagation()
    setDeletingId(reportId)
    const { error: delError } = await deleteReport(reportId)
    if (delError) {
      showToast('Failed to delete report.', 'error')
    } else {
      showToast('Report deleted.')
      setSavedReports(prev => prev.filter(r => r.id !== reportId))
      if (selectedReport === reportId) {
        setSelectedReport(null)
        setReport(null)
        setCareer('')
        setSkills('')
        setSaved(false)
      }
    }
    setDeletingId(null)
  }

  async function handleGenerate(e) {
    e.preventDefault()
    const trimmedCareer = career.trim()
    const trimmedSkills = skills.trim()

    if (!trimmedCareer || !trimmedSkills) {
      setError('Please enter a target career and your current skills.')
      return
    }

    setError(null)
    setReport(null)
    setSaved(false)
    setSelectedReport(null)
    setLoading(true)

    const result = await generateSkillGapAnalysis(trimmedCareer, trimmedSkills, education, experience)

    if (result.success && result.message) {
      setReport(result.message)
    } else {
      setError(result.error || 'Failed to generate the analysis. Please try again.')
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!user || !report) return
    setSaving(true)

    const { error: saveError } = await saveReport(user.id, career.trim(), skills.trim(), report)

    if (saveError) {
      showToast('Failed to save report. Please try again.', 'error')
    } else {
      setSaved(true)
      showToast('Report saved successfully!')
      // Refresh the saved reports list
      fetchSavedReports()
    }
    setSaving(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 p-2.5 text-white shadow-md">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                Skill Gap Analysis
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Discover exactly what skills you need to land your target career.
              </p>
            </div>
          </div>
        </div>

        {/* Guest notice */}
        {!user && (
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/40 dark:bg-blue-950/30">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can generate a free analysis as a guest.{' '}
              <a href="/login" className="font-semibold underline hover:no-underline">Sign in</a>{' '}
              to save your reports and access them later.
            </p>
          </div>
        )}

        {/* Analysis Form */}
        <form
          onSubmit={handleGenerate}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          aria-label="Skill gap analysis form"
        >
          <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Enter your details
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Target Career */}
            <div className="sm:col-span-2">
              <label htmlFor="career" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Target Career <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="career"
                type="text"
                required
                placeholder="e.g. Frontend React Developer"
                value={career}
                onChange={e => setCareer(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-400"
              />
            </div>

            {/* Current Skills */}
            <div className="sm:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Current Skills <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                List one skill per line, or separate with commas.
              </p>
              <textarea
                id="skills"
                required
                rows={4}
                placeholder={"HTML\nCSS\nJavaScript\nBasic React"}
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-400 resize-none"
              />
            </div>

            {/* Education Level */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Education Level <span className="text-zinc-400 text-xs">(optional)</span>
              </label>
              <select
                id="education"
                value={education}
                onChange={e => setEducation(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {EDUCATION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select education level...'}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Experience Level <span className="text-zinc-400 text-xs">(optional)</span>
              </label>
              <select
                id="experience"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {EXPERIENCE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select experience level...'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {loading ? (
                <><Loader className="h-4 w-4 animate-spin" /> Analysing...</>
              ) : (
                <><BrainCircuit className="h-4 w-4" /> Analyse My Skills</>
              )}
            </button>
          </div>
        </form>

        {/* Saved Reports List */}
        {user && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Your Saved Reports</h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Click any report to view its full analysis.</p>
            </div>
            {reportsLoading ? (
              <div className="p-6">
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                  ))}
                </div>
              </div>
            ) : savedReports.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center">
                <BrainCircuit className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No saved reports yet</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Generate and save an analysis above to see it here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {savedReports.map(r => (
                  <li key={r.id}>
                    <button
                      onClick={() => handleLoadReport(r.id)}
                      className={`group w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                        selectedReport === r.id ? 'bg-violet-50 dark:bg-violet-900/10' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 rounded-md bg-violet-50 p-1.5 text-violet-500 dark:bg-violet-900/20 dark:text-violet-400">
                        <BrainCircuit className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${
                          selectedReport === r.id
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}>
                          {r.career}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          {new Date(r.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteReport(r.id, e)}
                        disabled={deletingId === r.id}
                        aria-label="Delete report"
                        className="ml-1 flex-shrink-0 rounded p-1 text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingId === r.id
                          ? <Loader className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Loading state */}
        {(loading || reportLoading) && (
          <div id="report-output" className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Loader className="mx-auto h-8 w-8 animate-spin text-violet-500" />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {reportLoading ? 'Loading your saved report…' : 'CareerMind AI is analysing your skill gaps…'}
            </p>
            {loading && (
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                This may take up to 30 seconds.
              </p>
            )}
          </div>
        )}

        {/* Generated / Loaded Report */}
        <div id="report-output" />
        {report && !loading && !reportLoading && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Report Header */}
            <div className="flex flex-col gap-3 border-b border-zinc-100 p-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Skill Gap Analysis: <span className="text-violet-600 dark:text-violet-400">{career}</span>
                  </h2>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Generated by CareerMind AI
                </p>
              </div>

              {/* Save button */}
              {user && (
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  aria-label={saved ? 'Report saved' : 'Save this report'}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                    saved
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 cursor-default'
                      : 'bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-60'
                  }`}
                >
                  {saving ? (
                    <><Loader className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : saved ? (
                    <><CheckCircle className="h-4 w-4" /> Saved</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Report</>
                  )}
                </button>
              )}

              {/* Guest save prompt */}
              {!user && (
                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Save className="h-4 w-4" />
                  Sign in to save
                </a>
              )}
            </div>

            {/* Report Body */}
            <div className="p-6">
              <CollapsibleReport content={report} />
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </DashboardLayout>
  )
}
