import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Compass, Zap, Globe,
  Layers, ChevronRight, CheckCircle2, Star, Shield
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  const quickTriggers = [
    { text: 'BSCS vs Software Engineering', category: 'Comparison' },
    { text: 'How do I become a React Developer?', category: 'Roadmap' },
    { text: 'Which programming language should I learn?', category: 'Guidance' }
  ]

  return (
    <div className="bg-stone-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 min-h-screen relative overflow-hidden">

      {/* GLOW BACKGROUND SPHERES */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute top-0 left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[10%] w-[380px] h-[380px] bg-gradient-to-tr from-emerald-300 to-teal-400 rounded-full blur-[100px]" />
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 z-10 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-200 bg-violet-50/50 text-xs font-semibold text-violet-700 dark:border-violet-900/30 dark:bg-violet-950/20 dark:text-violet-400 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen Career Navigation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-zinc-900 dark:text-zinc-50">
            Navigate Your Future <br />
            With <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">CareerMind AI</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 max-w-xl leading-relaxed">
            Get context-aware learning paths, comparative degree reports, and personalized industry analysis in English or natural Roman Urdu.
          </p>

          {/* Dynamic Buttons */}
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-250 bg-white/70 px-6 py-3.5 text-base font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800/85 backdrop-blur-sm"
            >
              Open AI Chat
            </Link>
          </div>
        </div>

        {/* Right Preview Card Mockup */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />

            {/* Mock Chat Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">CareerMind Advisor</h4>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Fallback System
                </span>
              </div>
            </div>

            {/* Simulated Query Suggestions */}
            <div className="space-y-2.5">
              <p className="text-xs text-zinc-400 font-medium">Try asking:</p>
              {quickTriggers.map((trig, i) => (
                <Link
                  key={i}
                  to={`/chat?q=${encodeURIComponent(trig.text)}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 hover:bg-violet-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/20 dark:hover:bg-violet-950/20 transition-all group/item text-left"
                >
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">{trig.text}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover/item:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Quick Profile Vector Snapshot */}
            <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-800/60 flex justify-between items-center text-xs">
              <span className="text-zinc-450 dark:text-zinc-500 font-medium">Profile Sync</span>
              <span className="font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> Activated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: KEY CAPABILITIES (Minimalist Feature Grid) */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-zinc-200/50 dark:border-zinc-900/50 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-650 dark:text-violet-400">Features</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Intelligent design, high-quality results.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400 flex items-center justify-center shadow-sm">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Bilingual Support</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Chat natively using Roman Urdu or English. The advisor adapts dynamically to provide conversational guidance.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 flex items-center justify-center shadow-sm">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Adaptive Profile Memory</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Remembers your academic status, target career, and active skillsets so advice is custom-tailored to you.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Interactive Skill Gaps</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Generate instant roadmaps and lists of missing skills needed to land your target jobs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 px-4 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-900/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-650 dark:text-blue-400">Workflow</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
                Simple steps, professional direction
              </h2>
              <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-400 leading-relaxed">
                We remove manual syllabus comparison and search confusion. Just sync your profile details, start a dialogue, and build your personalized career map.
              </p>
            </div>

            {/* Right Steps Grid */}
            <div className="lg:col-span-7 space-y-4">
              {[
                { step: '01', title: 'Assemble Career Profile', desc: 'Add your current skills, target role, and experience.' },
                { step: '02', title: 'Consult AI Advisors', desc: 'Ask about degree variations, roadmaps, and certification weights.' },
                { step: '03', title: 'Bridge Skill Gaps', desc: 'Generate a structured list of missing skill objectives and practice tasks.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/20 items-start">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0 dark:bg-zinc-100 dark:text-zinc-900">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{item.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION (Glassmorphic / Gradient) */}
      <section className="py-20 px-4 max-w-5xl mx-auto mb-12 relative z-10">
        <div className="relative rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-600 to-blue-600 p-8 sm:p-12 md:p-16 text-center text-white shadow-xl overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[450px] h-[450px] bg-white/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[450px] h-[450px] bg-white/10 rounded-full blur-[90px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight relative z-20">
            Start Building Your Path with AI Guidance
          </h2>
          <p className="mt-4 text-sm sm:text-base text-violet-100 max-w-md mx-auto relative z-20 leading-relaxed">
            Get structured advice, roadmaps, and profile customization features. Free to start.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center relative z-20">
            <Link
              to={user ? "/chat" : "/login"}
              className="text-blue-700 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-violet-750 shadow-md transition-all hover:bg-zinc-50"
            >
              Start Chatting <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20 backdrop-blur-sm"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
