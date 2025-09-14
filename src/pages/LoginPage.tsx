import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { ExpenseAPI, UserAPI } from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuth((s) => s.login)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      await login(username, password)
      // Test the auth by making a request
      await ExpenseAPI.list()
      navigate('/')
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Invalid username or password')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long')
      setLoading(false)
      return
    }

    try {
      await UserAPI.register({
        username,
        password,
      })
      setSuccess('Registration successful! You can now login.')
      setActiveTab('login')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError('Username already exists')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(null)
  }

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    resetForm()
  }

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-white/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-3xl p-8 shadow-apple-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-apple">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'login' ? 'Sign in to your expense tracker' : 'Join us to track your expenses'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-white/20 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-gray-800 shadow-apple'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-gray-800 shadow-apple'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={onLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <input
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-semibold py-4 px-6 rounded-2xl shadow-apple hover:shadow-apple-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={onRegisterSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <input
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-semibold py-4 px-6 rounded-2xl shadow-apple hover:shadow-apple-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-6 bg-red-50/80 border border-red-200/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-50/80 border border-green-200/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

       
        </div>
      </div>
    </div>
  )
}