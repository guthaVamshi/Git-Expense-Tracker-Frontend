import { useEffect, useMemo, useState } from 'react'
import type { Expense } from '../lib/api'
import { ExpenseAPI } from '../lib/api'
import { useAuth } from '../store/auth'
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { LoadingButton, ModernLoader } from '../components/LoadingOverlay'

export default function DashboardPage() {
  const logout = useAuth((s) => s.logout)
  const username = useAuth((s) => s.username)
  const [items, setItems] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Expense>({ expense: '', expenseType: 'Expense', expenseAmount: '', paymentMethod: 'Cash', date: '' })
  const [month, setMonth] = useState<string>('')
  const [query, setQuery] = useState('')
  const [filterMode] = useState<'all' | 'monthly'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Loading states for different operations
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [operationMessage, setOperationMessage] = useState('')
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await ExpenseAPI.list()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    // default new form date to today
    setForm((f) => ({ ...f, date: f.date && f.date.length > 0 ? f.date : todayStr }))
  }, [todayStr])

  useEffect(() => {
    const fetchByMonth = async () => {
      if (filterMode === 'monthly' && month) {
        setLoading(true)
        try {
          const data = await ExpenseAPI.listByMonth(month)
          setItems(data)
        } finally {
          setLoading(false)
        }
      } else {
        // fallback to all when not monthly or no month selected
        load()
      }
    }
    fetchByMonth()
  }, [filterMode, month])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (form.id) {
        setOperationMessage('Updating transaction...')
        await ExpenseAPI.update(form)
        setOperationMessage('Transaction updated successfully!')
      } else {
        setOperationMessage('Adding transaction...')
        await ExpenseAPI.add(form)
        setOperationMessage('Transaction added successfully!')
      }
      
      setForm({ expense: '', expenseType: 'Expense', expenseAmount: '', paymentMethod: 'Cash', date: todayStr })
      await load()
      
      // Brief success message
      setTimeout(() => {
        setOperationMessage('')
        setIsSubmitting(false)
      }, 1000)
    } catch {
      setOperationMessage('Operation failed. Please try again.')
      setTimeout(() => {
        setOperationMessage('')
        setIsSubmitting(false)
      }, 2000)
    }
  }

  const onDelete = async (id?: number) => {
    if (!id) return
    setIsDeletingId(id)
    setOperationMessage('Deleting transaction...')
    
    try {
      await ExpenseAPI.remove(id)
      setOperationMessage('Transaction deleted successfully!')
      await load()
      
      // Brief success message
      setTimeout(() => {
        setOperationMessage('')
        setIsDeletingId(null)
      }, 1000)
    } catch {
      setOperationMessage('Failed to delete transaction.')
      setTimeout(() => {
        setOperationMessage('')
        setIsDeletingId(null)
      }, 2000)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      const name = (it.expense ?? '').toLowerCase()
      const type = (it.expenseType ?? '').toLowerCase()
      const passesQuery = q.length === 0 || name.includes(q) || type.includes(q)
      const passesMonth = month ? (it.date ?? '').startsWith(month) : true
      const passesMonthly = filterMode === 'all' || type.includes('monthly')
      return passesQuery && passesMonthly && passesMonth
    })
  }, [items, query, filterMode, month])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize])
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  useEffect(() => {
    setPage(1)
  }, [filterMode, month, query])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const chartData = useMemo(() => {
    // Coerce nulls and unknown types; plot single amount and also split heuristic
    return filtered.map((it) => {
      const name = it.expense && it.expense.trim().length > 0 ? it.expense : 'Untitled'
      const amount = Number(it.expenseAmount ?? 0) || 0
      const type = (it.expenseType ?? '').toLowerCase()
      const isIncome = type === 'income' || type === 'salary' || type === 'credit'
      const isConversion = type === 'conversion'
      return {
        name,
        Amount: amount,
        // Regular expenses (excluding conversions and income)
        Expense: !isIncome && !isConversion ? amount : 0,
        Income: isIncome ? amount : 0,
        // Conversions are outgoing money but tracked separately
        Conversion: isConversion ? amount : 0,
      }
    })
  }, [filtered])

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, it) => {
        const amount = Number(it.expenseAmount ?? 0) || 0
        const type = (it.expenseType ?? '').toLowerCase()
        const paymentMethod = (it.paymentMethod ?? '').toLowerCase()
        const isIncome = type === 'income' || type === 'salary' || type === 'credit'
        const isCreditCardPayment = type === 'credit card payment' || paymentMethod === 'credit card payment'
        const isConversion = type === 'conversion'
        
        // Total tracks all money movement
        acc.total += amount
        if (isIncome) {
          acc.income += amount
        } else if (isCreditCardPayment) {
          acc.creditCardPayments += amount
        } else if (isConversion) {
          acc.conversions += amount
          // Conversions are also part of total outgoing, but tracked separately
        } else {
          acc.expense += amount
        }
        return acc
      },
      { total: 0, income: 0, expense: 0, creditCardPayments: 0, conversions: 0 }
    )
  }, [filtered])

  // Net calculation: Income minus all outgoing money (expenses + conversions)
  const net = totals.income - (totals.expense + totals.conversions)
  const creditCardBalance = totals.expense - totals.creditCardPayments

  // Dynamic background based on profit/loss
  const backgroundClass = net >= 0 
    ? 'min-h-screen profit-gradient relative overflow-hidden' 
    : 'min-h-screen loss-gradient relative overflow-hidden'

  return (
    <div className={`${backgroundClass} matrix-bg`}>
      {/* Floating background elements for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {net >= 0 ? (
          // Profit floating elements - subtle greens
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-green-400/8 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-lime-300/12 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
          </>
        ) : (
          // Loss floating elements - subtle reds
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-red-400/8 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pink-300/12 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
          </>
        )}
      </div>
      
      <header className="relative z-10 glass-white border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold holographic animate-pulse-geeky">
                $ Paisa 
              </h1>
              <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-sm font-semibold shadow-apple backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
            net >= 0 
                  ? 'bg-green-50/80 text-green-800 border-green-200/50' 
                  : 'bg-red-50/80 text-red-800 border-red-200/50'
              }`}>
                <span className="text-xs opacity-70 block">Net Balance</span>
                <span className="text-base sm:text-lg font-bold">
                  {net >= 0 ? '+' : '-'}${Math.abs(net).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Info - Improved mobile visibility */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/40 rounded-xl backdrop-blur-sm border border-white/20 animate-slide-in-right">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm animate-pulse-geeky">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-semibold text-gray-800 truncate max-w-[80px] sm:max-w-none">
                    {username || 'User'}
                  </div>
                  <div className="text-gray-600 text-xs hidden sm:block">USER</div>
                </div>
              </div>
              
              {/* Sign Out Button - Icon only on mobile */}
              <button 
                onClick={logout} 
                className="px-3 sm:px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Search and Controls Section */}
        <div className="glass-card rounded-3xl p-6 shadow-apple-lg animate-fade-in">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
            <input
                  placeholder="Search expenses and income..."
                  className="glass-input w-full rounded-2xl pl-10 pr-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Show:</span>
            <select
                  className="glass-input rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
            </select>
              </div>
              
            <input
              type="month"
                className="glass-input rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
              
              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-1">
              <button
                  className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-white/30 transition-all duration-200"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                  ←
              </button>
                <span className="px-3 py-2 text-sm font-semibold text-gray-700 min-w-[80px] text-center">
                  {page} of {totalPages}
                </span>
              <button
                  className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-white/30 transition-all duration-200"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                  →
              </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-5">
          <section className="lg:col-span-5 glass-card rounded-3xl p-6 shadow-apple-lg animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
            </div>
            
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <input 
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Enter transaction description..."
                  value={form.expense} 
                  onChange={(e) => setForm({ ...form, expense: e.target.value })} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Type</label>
                  <select className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" value={form.expenseType} onChange={(e) => setForm({ ...form, expenseType: e.target.value })}>
                <option>Expense</option>
                <option>Income</option>
                <option>Credit Card Payment</option>
                <option>Conversion</option>
              </select>
            </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Method</label>
                  <select className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" value={form.paymentMethod ?? 'Cash'} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>
            </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm font-medium">$</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="glass-input w-full rounded-2xl pl-8 pr-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    placeholder="0.00"
                    value={form.expenseAmount} 
                    onChange={(e) => setForm({ ...form, expenseAmount: e.target.value })} 
                    required 
                  />
                </div>
            </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date</label>
                  <input 
                    type="date" 
                    className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    value={form.date ?? ''} 
                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  />
            </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Quick Month</label>
              <input
                type="month"
                    className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={(form.date ?? '').slice(0, 7)}
                onChange={(e) => setForm({ ...form, date: `${e.target.value}-01` })}
              />
            </div>
              </div>
              
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                loadingText={form.id ? 'Updating...' : 'Adding...'}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-semibold py-4 px-6 rounded-2xl shadow-apple hover:shadow-apple-lg transform hover:scale-[1.02] transition-all duration-200 btn-glitch relative overflow-hidden"
              >
                {form.id ? 'Update Transaction' : 'Add Transaction'}
              </LoadingButton>
          </form>
        </section>

          <section className="lg:col-span-3 space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {/* Overview Header */}
            <div className="glass-card rounded-3xl p-6 shadow-apple-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Conversions Card - Featured at the beginning */}
                <div className="glass-dark rounded-2xl p-4 hover:scale-105 transition-transform duration-200 border-2 border-purple-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Conversions</div>
                      <div className="text-lg font-bold text-purple-600">${totals.conversions.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark rounded-2xl p-4 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Income</div>
                      <div className="text-lg font-bold text-green-600">${totals.income.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark rounded-2xl p-4 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Expenses</div>
                      <div className="text-lg font-bold text-red-600">${totals.expense.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark rounded-2xl p-4 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">CC Payments</div>
                      <div className="text-lg font-bold text-blue-600">${totals.creditCardPayments.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark rounded-2xl p-4 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${creditCardBalance > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <svg className={`w-4 h-4 ${creditCardBalance > 0 ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">CC Balance</div>
                      <div className={`text-lg font-bold ${creditCardBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${Math.abs(creditCardBalance).toLocaleString()}
                      </div>
            </div>
            </div>
            </div>
              </div>
            </div>

            {/* Chart Section - Hidden on mobile */}
            <div className="hidden md:block glass-card rounded-3xl p-6 shadow-apple-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Transaction Trends</h3>
          </div>
              
              <div className="h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border border-white/20 p-4">
            {filtered.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm font-medium">No transaction data to display</p>
                    <p className="text-xs opacity-70">Add some transactions to see your trends</p>
                  </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="name" hide />
                    <YAxis stroke="rgba(0,0,0,0.5)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                      }}
                    />
                <Legend />
                    <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                    <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="Conversion" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorConversion)" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
            </div>
           
        </section>
        <section className="lg:col-span-8 space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
           
            {/* Transactions Table */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-apple-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                <div className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                  {filtered.length} items
                </div>
              </div>
              
              <div className="overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
                {loading ? (
                  <div className="p-8 text-center animate-fade-in">
                    <div className="inline-flex flex-col items-center gap-4 text-gray-500">
                      <div className="w-8 h-8 border-2 border-transparent border-t-slate-600 rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-slate-600">Loading transactions...</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs opacity-70">Add your first transaction to get started</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/30 backdrop-blur-sm">
                        <tr className="text-left">
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/20">
                        {paginated.map((it) => (
                          <tr key={it.id} className="hover:bg-white/20 transition-colors duration-200 group">
                            <td className="py-4 px-6">
                              <div className="font-medium text-gray-900">
                                {(it.expense && it.expense.trim().length > 0) ? it.expense : 'Untitled'}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                it.expenseType === 'Income' 
                                  ? 'bg-green-100 text-green-800'
                                  : it.expenseType === 'Credit Card Payment'
                                  ? 'bg-blue-100 text-blue-800'
                                  : it.expenseType === 'Conversion'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {it.expenseType ?? 'Unknown'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                              {it.paymentMethod ?? 'Cash'}
                            </td>
                            <td className="py-4 px-6">
                              <div className={`font-bold ${
                                it.expenseType === 'Income' 
                                  ? 'text-green-600' 
                                  : it.expenseType === 'Conversion'
                                  ? 'text-purple-600'
                                  : 'text-gray-900'
                              }`}>
                                ${Number(it.expenseAmount ?? 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                              {it.date ? new Date(it.date).toLocaleDateString() : ''}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button 
                                  className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                  onClick={() => setForm(it)}
                                  disabled={isSubmitting || isDeletingId !== null}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1"
                                  onClick={() => onDelete(it.id)}
                                  disabled={isSubmitting || isDeletingId !== null}
                                >
                                  {isDeletingId === it.id ? (
                                    <>
                                      <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                      <span>Deleting</span>
                                    </>
                                  ) : (
                                    'Delete'
                                  )}
                                </button>
                              </div>
                      </td>
                    </tr>
                        ))}
              </tbody>
            </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-3">
                    {paginated.map((it) => (
                      <div key={it.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {(it.expense && it.expense.trim().length > 0) ? it.expense : 'Untitled'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                it.expenseType === 'Income' 
                                  ? 'bg-green-100 text-green-800'
                                  : it.expenseType === 'Credit Card Payment'
                                  ? 'bg-blue-100 text-blue-800'
                                  : it.expenseType === 'Conversion'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {it.expenseType ?? 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-600">{it.paymentMethod || 'Cash'}</span>
                            </div>
                          </div>
                          <span className={`font-bold text-lg ${
                            it.expenseType === 'Income' 
                              ? 'text-green-600' 
                              : it.expenseType === 'Conversion'
                              ? 'text-purple-600'
                              : 'text-gray-900'
                          }`}>
                            ${Number(it.expenseAmount ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            {it.date ? new Date(it.date).toLocaleDateString() : 'No date'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setForm(it)}
                              disabled={isSubmitting || isDeletingId !== null}
                              className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => onDelete(it.id)}
                              disabled={isSubmitting || isDeletingId !== null}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-1"
                            >
                              {isDeletingId === it.id ? (
                                <>
                                  <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span>Deleting</span>
                                </>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
          </div>
        </section>
        </div>
      </main>
      
      {/* Modern Minimal Loading Overlay */}
      <ModernLoader 
        isVisible={isSubmitting || isDeletingId !== null} 
        message={operationMessage}
        variant={operationMessage.includes('successfully') ? 'dots' : 'ring'}
      />
    </div>
  )
}


