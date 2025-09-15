import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface NavbarProps {
  showAuthButtons?: boolean
  currentPage?: 'landing' | 'login' | 'dashboard'
}

export default function Navbar({ showAuthButtons = true, currentPage = 'landing' }: NavbarProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', active: currentPage === 'landing' },
    { label: 'Features', href: '#features', active: false },
    { label: 'About', href: '#about', active: false }
  ]

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Scroll to section if on landing page
      if (currentPage === 'landing') {
        const element = document.querySelector(href)
        element?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`/${href}`)
      }
    } else {
      navigate(href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="relative z-20 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4 shadow-apple-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-apple">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-2xl font-bold holographic">Money Find</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`font-medium transition-colors duration-200 ${
                    item.active 
                      ? 'text-indigo-600 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Auth Buttons */}
            {showAuthButtons && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 font-medium transition-colors duration-200 ${
                    currentPage === 'login'
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-200/50 animate-slide-up">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left py-2 font-medium transition-colors duration-200 ${
                      item.active 
                        ? 'text-indigo-600 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {showAuthButtons && (
                  <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-200/50">
                    <button
                      onClick={() => {
                        navigate('/login')
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-left py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate('/login')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
