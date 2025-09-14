import { useEffect, useState } from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  type?: 'default' | 'success' | 'error'
}

export default function LoadingOverlay({ 
  isVisible, 
  message = 'Processing...', 
  type = 'default' 
}: LoadingOverlayProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!show) return null

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white/95',
          text: 'text-emerald-700',
          accent: 'bg-emerald-500'
        }
      case 'error':
        return {
          bg: 'bg-white/95',
          text: 'text-red-700',
          accent: 'bg-red-500'
        }
      default:
        return {
          bg: 'bg-white/95',
          text: 'text-slate-700',
          accent: 'bg-slate-700'
        }
    }
  }

  const theme = getTheme()

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
    >
      {/* Minimal Modern Card */}
      <div 
        className={`${theme.bg} backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 animate-slide-up min-w-[240px]`}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Minimal Spinner */}
          <div className="relative">
            <div className={`w-8 h-8 ${theme.accent} rounded-full animate-pulse opacity-20`}></div>
            <div 
              className={`w-8 h-8 border-2 border-transparent border-t-current ${theme.text} rounded-full animate-spin absolute top-0 left-0`}
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
          
          {/* Simple Message */}
          <p className={`${theme.text} text-sm font-medium text-center`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

// Minimal inline loader for smaller spaces
export function InlineLoader({ 
  size = 'sm', 
  color = 'primary'
}: { 
  size?: 'xs' | 'sm' | 'md'
  color?: 'primary' | 'white' | 'gray' | 'success' | 'error'
}) {
  const sizeClasses = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2'
  }

  const colorClasses = {
    primary: 'border-slate-600',
    white: 'border-white',
    gray: 'border-gray-400',
    success: 'border-emerald-500',
    error: 'border-red-500'
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} border-transparent border-t-current rounded-full animate-spin`}></div>
  )
}

// Modern button with integrated loading state
export function LoadingButton({ 
  children, 
  loading = false, 
  loadingText = 'Loading...', 
  className = '', 
  ...props 
}: {
  children: React.ReactNode
  loading?: boolean
  loadingText?: string
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  
  return (
    <button 
      {...props} 
      disabled={loading || props.disabled}
      className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''} transition-all duration-200`}
    >
      {/* Button Content */}
      <span className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <InlineLoader size="sm" color="white" />
            <span className="text-sm font-medium">{loadingText}</span>
          </div>
        </div>
      )}
    </button>
  )
}

// Modern minimal loader
export function ModernLoader({ 
  isVisible, 
  message = 'Processing...', 
  variant = 'simple' 
}: { 
  isVisible: boolean
  message?: string
  variant?: 'simple' | 'dots' | 'ring'
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!show) return null

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )
      case 'ring':
        return (
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        )
      default:
        return (
          <div className="w-6 h-6 border-2 border-transparent border-t-slate-600 rounded-full animate-spin"></div>
        )
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 animate-slide-up min-w-[200px]">
        <div className="flex flex-col items-center gap-3">
          {renderLoader()}
          <p className="text-slate-700 text-sm font-medium text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
