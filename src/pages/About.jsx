import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Compass, Shield, Zap, Users, Target,
  Database, Cpu, BookOpen, Layers, Globe, Lock, CheckCircle2,
  ChevronDown, ChevronUp, GraduationCap, TrendingUp, Workflow,
  BrainCircuit, CheckCircle, BarChart3, Star, Server, Check, HelpCircle, FileText
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

// Configure data arrays for cleanliness and easy maintenance
const features = [
  {
    icon: BrainCircuit,
    title: 'AI Career Advisor',
    description: 'Context-aware career advice tailored to regional and global market realities.',
    badge: 'Core'
  },
  {

    icon: Layers,
    title: 'Career Profile Memory',
    description: 'Remembers your education, goals, and experience to provide personalized context.',
    badge: 'Memory'
  },
  {
    icon: Workflow,
    title: 'Multi-AI Architecture',
    description: 'Dynamic failover across Gemini, Grok, and OpenRouter for maximum reliability.',
    badge: 'Architecture'
  },
  {
    icon: Globe,
    title: 'Roman Urdu + English Support',
    description: 'Chat naturally in English, formal Urdu, or natural Roman Urdu (bilingual).',
    badge: 'Bilingual'
  },
  {
    icon: Compass,
    title: 'Skill Gap Analysis',
    description: 'Get an honest list of missing skills and priority learning paths to bridge them.',
    badge: 'Analysis'
  },
  {
    icon: Target,
    title: 'Career Roadmaps',
    description: 'Generates structured learning paths, project ideas, and certification recommendations.',
    badge: 'Roadmaps'
  },
  {
    icon: Server,
    title: 'Modern Dashboard',
    description: 'Track your career goals, active roadmaps, and profile snapshot in one hub.',
    badge: 'Dashboard'
  },
  {
    icon: Lock,
    title: 'Secure Authentication',
    description: 'Powered by Supabase auth to keep your conversations and credentials secure.',
    badge: 'Security'
  },
  {
    icon: FileText,
    title: 'Resume Builder & Parser',
    description: 'Analyze and optimize your resume keywords to beat ATS checkers.',
    badge: 'Coming Soon',
    comingSoon: true
  }
]

const steps = [
  {
    number: '01',
    title: 'Create Free Account',
    description: 'Sign up securely in seconds. Your data is protected and private by default.'
  },
  {
    number: '02',
    title: 'Build Career Profile',
    description: 'Enter your education level, current skills, interests, and target careers.'
  },
  {
    number: '03',
    title: 'Consult AI Mentors',
    description: 'Start a dialogue in Roman Urdu or English to explore options and test pathways.'
  },
  {
    number: '04',
    title: 'Receive Custom Guidance',
    description: 'Generate real-time roadmaps, skill analyses, and career snapshot updates.'
  }
]

const technologies = [
  { name: 'React', desc: 'Component-driven frontend library', category: 'Frontend', icon: Layers },
  { name: 'Vite', desc: 'Next-gen bundler for fast development', category: 'Build System', icon: Zap },
  { name: 'Tailwind CSS', desc: 'Utility-first utility styling framework', category: 'Styling', icon: Star },
  { name: 'Supabase', desc: 'Backend-as-a-service with auth & DB', category: 'Backend & DB', icon: Database },
  { name: 'OpenRouter', desc: 'API routing to multiple major LLMs', category: 'AI Infra', icon: Workflow },
  { name: 'Grok', desc: 'Logical reasoning and real-time inputs', category: 'LLM', icon: Cpu },
  { name: 'Gemini', desc: 'High-context multilingual processing', category: 'LLM', icon: Sparkles },
  { name: 'JavaScript', desc: 'Clean ES6+ core application logic', category: 'Language', icon: CodeIcon }
]

// Simple local fallback for CodeIcon since Lucide might not have CodeIcon directly
function CodeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  )
}

const values = [
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Constantly integrating state-of-the-art AI advancements to offer career coaching.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We believe your career plans and profile details should belong entirely to you.'
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Making premium career mentorship accessible to everyone, free of charge.'
  },
  {
    icon: GraduationCap,
    title: 'Continuous Growth',
    description: 'Enabling individuals to adapt and transition to changing workforce environments.'
  },
  {
    icon: CheckCircle,
    title: 'Unbiased Integrity',
    description: 'Providing realistic guidance and skill gap estimations without external influence.'
  },
  {
    icon: Target,
    title: 'Hyper-Personalization',
    description: 'Ensuring every roadmap and advice block matches your distinct starting profile.'
  }
]

const stats = [
  { value: '124K+', label: 'AI Conversations', desc: 'Sessions completed successfully' },
  { value: '85K+', label: 'Roadmaps Generated', desc: 'Personalized career paths created' },
  { value: '320K+', label: 'Skills Evaluated', desc: 'Strengths and skill gaps identified' },
  { value: '15K+', label: 'Users Supported', desc: 'Students and professionals helped' },
  { value: '94.8%', label: 'User Satisfaction', desc: 'Positive rating on career advice quality' }
]

const roadmap = {
  completed: [
    { title: 'Secure Authentication', desc: 'Robust signup and login workflows via Supabase.' },
    { title: 'Personalized Dashboard', desc: 'Sleek center to manage goals, snaps, and reports.' },
    { title: 'Dynamic AI Chat', desc: 'High-context counseling and conversation memory.' },
    { title: 'Bilingual Support', desc: 'Seamless Roman Urdu & English processing.' },
    { title: 'Interactive Roadmaps', desc: 'Generating detailed, structured learning steps.' },
    { title: 'Multi-AI Architecture', desc: 'Dynamic failover across Gemini, Grok, and OpenRouter.' }
  ],
  upcoming: [
    { title: 'Resume ATS Analysis', desc: 'Critiques resume keywords, layouts, and formatting.' },
    { title: 'Active Skill Tracking', desc: 'Mark skills as complete and watch your gap reports update.' },
    { title: 'Curated Learning Assets', desc: 'Auto-links specific courses, books, and videos for roadmaps.' },
    { title: 'Mock Interview Sandbox', desc: 'Simulate technical or HR interviews tailored to your goal.' },
    { title: 'Direct Job Matchmaker', desc: 'Connects career plans with live remote jobs listings.' }
  ]
}

const faqs = [
  {
    question: 'Is CareerMind AI free to use?',
    answer: 'Yes! CareerMind AI offers its entire core platform — including AI Chat, Career Roadmaps, and Skill Gap Analysis — completely free of charge for students and transitioning professionals.'
  },
  {
    question: 'How does the AI remember our conversations?',
    answer: 'We utilize a Profile Memory system. When you discuss your career background or learn new topics, the AI remembers context from the past 10 messages of the conversation. Authenticated users also have their profiles saved securely in our Supabase database to influence future conversations.'
  },
  {
    question: 'Can I write questions in Roman Urdu?',
    answer: 'Absolutely! CareerMind AI has advanced bilingual triggers. If you write in Roman Urdu (e.g. "mujhe React ka roadmap chahiye"), the AI will instantly reply in natural, conversational Roman Urdu style, acting as a friendly Pakistani career mentor.'
  },
  {
    question: 'Is my data secure?',
    answer: 'We secure all authentication and profile tables using Supabase. Your private credentials, conversation logs, and career profile metrics are strictly protected.'
  },
  {
    question: 'Can I delete my chat history?',
    answer: 'Yes. You have full control over your chat sessions. You can delete individual chats or clear your entire dashboard history inside the settings dashboard.'
  }
]

export default function About() {
  const { user } = useAuth()
  const [activeFaq, setActiveFaq] = useState(null)
  const [animatedStats, setAnimatedStats] = useState(false)

  // Trigger statistic animation view entry
  useEffect(() => {
    setAnimatedStats(true)
  }, [])

  return (
    <div className="bg-stone-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 min-h-screen">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none opacity-40 dark:opacity-30 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] bg-gradient-to-br from-violet-400 to-blue-500 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-300 to-teal-400 rounded-full blur-[120px]" />
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 z-10 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-violet-200 bg-violet-50/50 text-xs font-semibold text-violet-700 dark:border-violet-900/30 dark:bg-violet-950/20 dark:text-violet-400 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="h-3.5 w-3.5" /> Introducing CareerMind AI 2.0
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Empowering Career Journeys with <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">Intelligent AI Mentorship</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700">
          An adaptive SaaS platform providing professional roadmaps, structured skill-gap reports, and automated counseling to bridge academic milestones and live industry demands.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Link
            to={user ? "/chat" : "/login"}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Start AI Chat <ArrowRight className="h-5 w-5" />
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-6 py-3.5 text-base font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800/80 backdrop-blur-sm"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* SECTION 2 & 3: WHO WE ARE & MISSION (2-Column Grid) */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              <Compass className="h-4 w-4" /> Who We Are
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              An intelligent, responsive system to clarify your career pathway.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We started CareerMind AI because student and professional career planning is broken. Static syllabus structures fail to adapt to live workplace requirements. Technologies emerge faster than course modules can change.
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Our platform matches personalized profile vectors against state-of-the-art LLMs to identify specific learning objectives, predict job opportunities, and recommend localized timelines.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-blue-50/50 p-6 sm:p-8 dark:border-violet-950/20 dark:from-violet-950/10 dark:to-blue-950/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-6 shadow-md shadow-violet-500/20">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">Our Dedicated Mission</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To replace guesswork in education. We strive to give students, bootcamp developers, and transitioning experts the tools, real-time roadmaps, and confidence to unlock global remote jobs, local opportunities, and freelance success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VISION */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-stone-100 to-stone-50 dark:from-zinc-900/40 dark:to-zinc-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-4 w-4" /> Our Long-Term Vision
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Building the global AI Career Companion
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We envision a ecosystem where your career history matches directly with live freelance project scopes and global tech integrations. CareerMind AI aims to serve as a continuous career counselor that guides you from your first line of code up to a senior engineering leadership seat.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="p-5 rounded-xl bg-white border border-zinc-200/60 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold text-zinc-950 dark:text-zinc-100">Global AI Mentor</h4>
              <p className="text-xs text-zinc-500 mt-2">Instant answers in Roman Urdu or English on any tech stack.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-zinc-200/60 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold text-zinc-950 dark:text-zinc-100">Dynamic Readiness</h4>
              <p className="text-xs text-zinc-500 mt-2">Adjust plans in real time when new framework updates launch.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-zinc-200/60 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold text-zinc-950 dark:text-zinc-100">Career Companion</h4>
              <p className="text-xs text-zinc-500 mt-2">Persistently tracks milestones and skill changes over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHAT MAKES US DIFFERENT */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Star className="h-4 w-4" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Designed for modern tech aspirants
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            No generic responses. Everything is parsed, localized, and contextually validated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-zinc-850 dark:bg-zinc-900/40 hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400 transition-colors group-hover:bg-violet-600 group-hover:text-white duration-350">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${feature.comingSoon
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-650 dark:text-zinc-405 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS */}
      <section className="py-20 px-4 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200/60 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Four simple steps to clarity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Horizontal timeline link line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-violet-200 via-blue-200 to-violet-200 dark:from-violet-950 dark:via-blue-950 dark:to-violet-950 z-0" />

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-zinc-200 flex items-center justify-center font-bold text-xl text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 shadow-sm shadow-zinc-100 dark:shadow-none group-hover:border-violet-500 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TECHNOLOGY STACK */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Under the Hood</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Technical Architecture</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">We utilize highly optimized libraries and services to keep responses fast and lightweight.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div key={i} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center gap-4">
                <div className="rounded-xl bg-zinc-50 p-2.5 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 leading-none">{tech.name}</h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1.5">{tech.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: CORE VALUES */}
      <section className="py-20 px-4 bg-stone-100/50 dark:bg-zinc-900/10 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Ethics & Principles</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What guides our decisions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 flex items-start gap-4">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50 mb-1.5">{val.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: WHY CHOOSE CAREERMIND (2-Column Benefits Layout) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Glassmorphic Widget Container */}
            <div className="relative w-full max-w-sm rounded-3xl border border-violet-100 bg-gradient-to-tr from-violet-500 to-blue-600 p-8 text-white shadow-2xl overflow-hidden aspect-[4/5] flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="space-y-4">
                <BrainCircuit className="h-12 w-12" />
                <h3 className="text-2xl font-bold leading-tight">Instant bilingual career advisory, active profiles, and roadmaps.</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs bg-white/10 rounded-full px-3 py-1.5 w-max">
                  <Check className="h-3 w-3" /> Safe & Private
                </div>
                <p className="text-xs text-violet-100">Ready to consult your roadmap 24/7.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Advantages</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Structured pathways instead of internet static</h2>
            <div className="space-y-4">
              {[
                'AI-powered responses using state-of-the-art fallback logic.',
                'Direct memory link against your active education/skills profile.',
                'Interactive Roadmaps with direct project concepts and timeline guides.',
                'Urdu/Roman Urdu bilingual responses dynamically matching your tone.',
                'Zero setup or subscription costs to get initial career clarity.'
              ].map((adv, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-normal">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: PROJECT STATISTICS */}
      <section className="py-16 bg-zinc-900 text-white dark:bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 text-center transition-all duration-1000 ${animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="font-semibold text-xs sm:text-sm text-zinc-300">{stat.label}</div>
                <div className="text-[10px] text-zinc-500 max-w-xs mx-auto">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: ROADMAP (Completed vs Upcoming) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Roadmap</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Development Timeline</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Where we are and what we are working on next.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Completed Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <CheckCircle2 className="h-5 w-5" /> Completed Milestones
            </h3>
            <div className="space-y-4">
              {roadmap.completed.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900/20">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-violet-600 dark:text-violet-400 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <TrendingUp className="h-5 w-5" /> Upcoming Core Goals
            </h3>
            <div className="space-y-4">
              {roadmap.upcoming.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl" />
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQS ACCORDION */}
      <section className="py-20 px-4 bg-zinc-100/50 dark:bg-zinc-900/10 border-t border-zinc-200/60 dark:border-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <HelpCircle className="h-8 w-8 text-violet-500 mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900/40 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left text-base font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-violet-500" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 13: CALL TO ACTION (Glassmorphic / Gradient) */}
      <section className="py-20 px-4 max-w-6xl mx-auto mb-16 relative">
        <div className="relative rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-600 to-blue-600 p-8 sm:p-12 md:p-16 text-center text-white shadow-xl overflow-hidden z-10">
          <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight relative z-20">
            Start Building Your Career with AI Counselor
          </h2>
          <p className="mt-4 text-base sm:text-lg text-violet-100 max-w-xl mx-auto relative z-20">
            Unlock priority skills roadmaps, gap report analyzers, and custom technical advice in natural Roman Urdu or English.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center relative z-20">
            <Link
              to={user ? "/chat" : "/login"}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-violet-700 shadow-md transition-all hover:bg-zinc-50"
            >
              Start Chat <ArrowRight className="h-5 w-5" />
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/20 backdrop-blur-sm"
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
