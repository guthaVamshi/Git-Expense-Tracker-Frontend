import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export function setBasicAuth(username: string, password: string) {
  const token = btoa(`${username}:${password}`)
  api.defaults.headers.common['Authorization'] = `Basic ${token}`
  localStorage.setItem('auth.basic', token)
  localStorage.setItem('auth.user', username)
}

export function clearAuth() {
  delete api.defaults.headers.common['Authorization']
  localStorage.removeItem('auth.basic')
  localStorage.removeItem('auth.user')
}

export function loadAuthFromStorage() {
  const token = localStorage.getItem('auth.basic')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Basic ${token}`
  }
}

// Load auth on startup
loadAuthFromStorage()

// Always attach Authorization header from storage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.basic')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Basic ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export type Expense = {
  id?: number
  expense: string
  expenseType: string
  expenseAmount: string
  paymentMethod?: string
  date?: string
}

export type User = {
  id?: number
  username: string
  password?: string
  role?: string
}

export const ExpenseAPI = {
  list: async () => {
    const { data } = await api.get<Expense[]>('/all')
    return data
  },
  listByMonth: async (yearMonth: string) => {
    const { data } = await api.get<Expense[]>(`/by-month/${yearMonth}`)
    return data
  },
  add: async (payload: Expense) => {
    const { data } = await api.post<Expense>('/add', payload)
    return data
  },
  update: async (payload: Expense) => {
    const { data } = await api.put<Expense>('/updateExpense', payload)
    return data
  },
  remove: async (id: number) => {
    const { data } = await api.delete(`/delete/${id}`)
    return data as string
  },
}

export const UserAPI = {
  register: async (payload: User) => {
    const { data } = await api.post<User>('/register', payload)
    return data
  },
}