import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { ExpenseAPI, UserAPI } from '../lib/api'
import { LoadingButton } from '../components/LoadingOverlay'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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

  // Interface for form validation
  interface FormValidation {
    isValid: boolean
    errors: string[]
  }

  // Validation helper function with TypeScript
  const validateForm = (): FormValidation => {
    const errors: string[] = []
    
    if (!username.trim()) {
      errors.push('Username is required')
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters')
    }
    
    if (!password) {
      errors.push('Password is required')
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters')
    }
    
    if (activeTab === 'register' && password !== confirmPassword) {
      errors.push('Passwords do not match')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Clear form when switching tabs
  useEffect(() => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(null)
  }, [activeTab])

  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const validation = validateForm()
    if (!validation.isValid) {
      setError(validation.errors[0])
      setLoading(false)
      return
    }

    try {
      await login(username, password)
      // Test the auth by making a request
      await ExpenseAPI.list()
      navigate('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error?.response?.status === 401) {
        setError('Invalid username or password')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const onRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const validation = validateForm()
    if (!validation.isValid) {
      setError(validation.errors[0])
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
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error?.response?.status === 409) {
        setError('Username already exists')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-pink-400/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navbar */}
      <Navbar showAuthButtons={false} currentPage="login" />

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Marketing Content */}
            <div className="hidden lg:block">
              <div className="animate-slide-up">
                <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                  <span className="holographic">Welcome to</span>
                  <br />
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Money Find</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Take control of your finances with our intuitive expense tracking platform. 
                  Simple, secure, and designed for modern users.
                </p>
                
                {/* Feature Highlights */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with industry-standard security' },
                    { icon: '📊', title: 'Visual Insights', desc: 'Beautiful charts and analytics to understand your spending' },
                    { icon: '⚡', title: 'Fast & Modern', desc: 'Built with the latest web technologies for optimal performance' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 glass-card rounded-xl shadow-apple">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Setup in minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="glass-card rounded-3xl p-8 shadow-apple-xl animate-slide-up">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-apple">
                    <span className="text-white font-bold text-2xl">₹</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-slate-600">
                    {activeTab === 'login' 
                      ? 'Sign in to your account to continue' 
                      : 'Join thousands of users managing their expenses'
                    }
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100/50 rounded-2xl p-1 mb-6">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      activeTab === 'login'
                        ? 'bg-white text-slate-800 shadow-apple'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                    onClick={() => switchTab('login')}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      activeTab === 'register'
                        ? 'bg-white text-slate-800 shadow-apple'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                    onClick={() => switchTab('register')}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-slide-up">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm animate-slide-up">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>{success}</span>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form onSubmit={onLoginSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="login-username" className="block text-sm font-semibold text-slate-700 mb-2">
                        Username
                      </label>
                      <input
                        id="login-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl border border-slate-200/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        placeholder="Enter your username"
                        autoComplete="username"
                        required
                        minLength={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>
                      <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl border border-slate-200/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        minLength={6}
                      />
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200"
                      loadingText="Signing in..."
                    >
                      Sign In
                    </LoadingButton>
                  </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <form onSubmit={onRegisterSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="register-username" className="block text-sm font-semibold text-slate-700 mb-2">
                        Username
                      </label>
                      <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl border border-slate-200/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        placeholder="Choose a username"
                        autoComplete="username"
                        required
                        minLength={3}
                      />
                      <p className="text-xs text-slate-500 mt-1">Minimum 3 characters</p>
                    </div>

                    <div>
                      <label htmlFor="register-password" className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>
                      <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl border border-slate-200/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label htmlFor="register-confirm" className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="register-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl border border-slate-200/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200"
                      loadingText="Creating Account..."
                    >
                      Create Account
                    </LoadingButton>
                  </form>
                )}

                {/* Switch Form Link */}
                <div className="mt-6 text-center text-sm text-slate-600">
                  <p>
                    {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
                    >
                      {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer variant="auth" />
    </div>
  )
}