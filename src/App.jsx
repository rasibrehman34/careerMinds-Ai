import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import PublicRoute from './components/PublicRoute'
import Home from './pages/Home'
import About from './pages/About'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Signout from './pages/Signout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ChatHistory from './pages/ChatHistory'
import SavedCareers from './pages/SavedCareers'
import SavedComparisons from './pages/SavedComparisons'
import SkillGap from './pages/SkillGap'
import { isAuthRoute, isProtectedRoute } from './utils/protectedRoute'
import { useAuth } from './hooks/useAuth'

function AppContent() {
  const location = useLocation()
  const { user } = useAuth()

  const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
  const isAuthPage = isAuthRoute(location.pathname)
  const isProtected = isProtectedRoute(location.pathname)
  const showPublicHeader = !isAuthPage && !isProtected && (!isChatPage || !user)
  // console.log(location, '========>>>>>>')
  return (
    <div className={`flex min-h-screen flex-col bg-stone-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 ${isProtected ? 'h-screen overflow-hidden' : ''}`}>
      {showPublicHeader && <Header />}
      <main className={isProtected || isChatPage ? 'flex-1 flex flex-col' : 'flex min-h-0 flex-1 flex-col'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Chat handles its own layout: DashboardLayout for logged-in, plain for guests */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route path="/signout" element={<Signout />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat-history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
          <Route path="/saved-careers" element={<ProtectedRoute><SavedCareers /></ProtectedRoute>} />
          <Route path="/dashboard/saved-comparisons" element={<ProtectedRoute><SavedComparisons /></ProtectedRoute>} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isChatPage && !isAuthPage && !isProtected && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
