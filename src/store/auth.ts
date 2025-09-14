import { create } from 'zustand'
import { clearAuth, loadAuthFromStorage, setBasicAuth } from '../lib/api'

type AuthState = {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

// Load auth from storage on startup
loadAuthFromStorage()

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('auth.basic'),
  username: localStorage.getItem('auth.user') || null,
  login: async (username: string, password: string) => {
    setBasicAuth(username, password)
    set({ isAuthenticated: true, username })
  },
  logout: () => {
    clearAuth()
    set({ isAuthenticated: false, username: null })
  },
}))