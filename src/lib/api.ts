import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000, // 10 second timeout
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

// Retry utility for failed requests
const retryRequest = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn()
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
    if (retries > 0 && axiosError.response?.status === 500) {
      const errorMessage = axiosError.response?.data?.message || ''
      if (errorMessage.includes('transaction is aborted') || 
          errorMessage.includes('current transaction is aborted')) {
        console.warn(`Database transaction error, retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return retryRequest(fn, retries - 1, delay * 2)
      }
    }
    throw error
  }
}

// Always attach Authorization header from storage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.basic')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Basic ${token}`
  }
  return config
})

// Handle auth errors and database transaction errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    
    // Handle database transaction errors
    if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || ''
      if (errorMessage.includes('transaction is aborted') || 
          errorMessage.includes('current transaction is aborted')) {
        console.warn('Database transaction error detected, retrying request...')
        // You could implement retry logic here if needed
      }
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
    return retryRequest(async () => {
      const { data } = await api.get<Expense[]>('/all')
      return data
    })
  },
  listByMonth: async (yearMonth: string) => {
    return retryRequest(async () => {
      const { data } = await api.get<Expense[]>(`/by-month/${yearMonth}`)
      return data
    })
  },
  add: async (payload: Expense) => {
    return retryRequest(async () => {
      const { data } = await api.post<Expense>('/add', payload)
      return data
    })
  },
  update: async (payload: Expense) => {
    return retryRequest(async () => {
      const { data } = await api.put<Expense>('/updateExpense', payload)
      return data
    })
  },
  remove: async (id: number) => {
    return retryRequest(async () => {
      const { data } = await api.delete(`/delete/${id}`)
      return data as string
    })
  },
}

export const UserAPI = {
  register: async (payload: User) => {
    const { data } = await api.post<User>('/register', payload)
    return data
  },
}