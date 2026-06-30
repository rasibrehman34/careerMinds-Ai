import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Check, Edit2, X, Loader } from 'lucide-react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../../services/careerGoalsService'
import { useAuth } from '../../hooks/useAuth'

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed']

const STATUS_STYLES = {
  'Not Started': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Completed': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export default function CareerGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchGoals() {
      if (user?.id) {
        setLoading(true)
        const { data } = await getGoals(user.id)
        if (data) setGoals(data)
        setLoading(false)
      }
    }
    fetchGoals()
  }, [user])

  async function handleAdd() {
    const title = newTitle.trim()
    if (!title || !user?.id) return
    setSaving(true)
    const { data, error } = await createGoal(user.id, title)
    if (!error && data) {
      setGoals(prev => [data, ...prev])
    }
    setNewTitle('')
    setAdding(false)
    setSaving(false)
  }

  async function handleStatusChange(goalId, status) {
    // Optimistic update
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status } : g))
    await updateGoal(goalId, { status })
  }

  async function handleRenameSubmit(goalId) {
    const title = editTitle.trim()
    if (!title) { setEditingId(null); return }
    // Optimistic update
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, title } : g))
    setEditingId(null)
    await updateGoal(goalId, { title })
  }

  async function handleDelete(goalId) {
    // Optimistic update
    setGoals(prev => prev.filter(g => g.id !== goalId))
    await deleteGoal(goalId)
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Career Goals</h2>
        </div>
        <button
          onClick={() => { setAdding(true); setEditingId(null) }}
          aria-label="Add a new career goal"
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>

      {/* New goal input */}
      {adding && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            placeholder="e.g. Become a React Developer"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-400"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newTitle.trim()}
            aria-label="Save goal"
            className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setAdding(false)}
            aria-label="Cancel"
            className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Goals list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No career goals yet. Add your first goal to get started!
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Career goals list">
          {goals.map(goal => (
            <li
              key={goal.id}
              className="group flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
            >
              {/* Status toggle */}
              <button
                onClick={() => {
                  const next = STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(goal.status) + 1) % STATUS_OPTIONS.length]
                  handleStatusChange(goal.id, next)
                }}
                aria-label={`Status: ${goal.status}. Click to change.`}
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${STATUS_STYLES[goal.status]}`}
              >
                {goal.status}
              </button>

              {/* Title / edit input */}
              {editingId === goal.id ? (
                <input
                  type="text"
                  autoFocus
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(goal.id); if (e.key === 'Escape') setEditingId(null) }}
                  className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-2 py-0.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              ) : (
                <span
                  className={`min-w-0 flex-1 truncate text-sm font-medium ${
                    goal.status === 'Completed'
                      ? 'text-zinc-400 line-through dark:text-zinc-600'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {goal.title}
                </span>
              )}

              {/* Action buttons (visible on hover or focus) */}
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {editingId === goal.id ? (
                  <>
                    <button
                      onClick={() => handleRenameSubmit(goal.id)}
                      aria-label="Save rename"
                      className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel rename"
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setEditingId(goal.id); setEditTitle(goal.title) }}
                    aria-label="Edit goal"
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(goal.id)}
                  aria-label="Delete goal"
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
