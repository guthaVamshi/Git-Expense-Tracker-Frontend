import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Add, edit, and delete your expenses with simple category management.',
      color: 'from-emerald-400 to-green-500'
    },
    {
      icon: '📊',
      title: 'Visual Dashboard',
      description: 'View your spending patterns with clean charts and summaries.',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: '🔐',
      title: 'Secure Login',
      description: 'Protected user accounts with secure authentication.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works beautifully on desktop, tablet, and mobile devices.',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: '⚡',
      title: 'Fast & Modern',
      description: 'Built with React and modern web technologies for smooth performance.',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: '🎨',
      title: 'Beautiful UI',
      description: 'Clean, modern interface inspired by the latest design trends.',
      color: 'from-yellow-400 to-orange-500'
    }
  ]

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Freelancer',
      content: 'Simple and clean interface. Perfect for tracking my project expenses.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'Small Business Owner',
      content: 'Helps me keep track of business expenses without any complexity.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Student',
      content: 'Great for managing my monthly budget and understanding where my money goes.',
      avatar: '👨‍🎓',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-pink-400/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-4 shadow-apple-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-apple">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <span className="text-2xl font-bold holographic">Money Find</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
                <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Reviews</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200 btn-glitch"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="holographic">Simple</span>
              <br />
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Expense Tracking</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A clean, modern expense tracker built with React. 
              Track your spending, manage categories, and view your financial overview with a beautiful interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-apple-lg hover:shadow-apple-xl transform hover:scale-105 transition-all duration-300 btn-glitch text-lg"
              >
                Try It Now
              </button>
              <button className="px-8 py-4 glass-card text-slate-700 font-semibold rounded-2xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-300 text-lg">
                View Features
              </button>
            </div>
          </div>
          
          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="glass-card rounded-3xl p-8 shadow-apple-xl max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
                {/* Mock Dashboard */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass-dark rounded-xl p-4">
                    <div className="text-emerald-400 text-sm font-medium">Income</div>
                    <div className="text-white text-2xl font-bold">$8,240</div>
                  </div>
                  <div className="glass-dark rounded-xl p-4">
                    <div className="text-red-400 text-sm font-medium">Expenses</div>
                    <div className="text-white text-2xl font-bold">$3,890</div>
                  </div>
                  <div className="glass-dark rounded-xl p-4">
                    <div className="text-blue-400 text-sm font-medium">Balance</div>
                    <div className="text-white text-2xl font-bold">$4,350</div>
                  </div>
                </div>
                
                <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-end justify-center p-4">
                  <div className="flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 70, 85, 60].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-sm animate-pulse"
                        style={{
                          width: '12px',
                          height: `${height}%`,
                          animationDelay: `${i * 200}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 holographic">Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, effective tools to help you track and understand your expenses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-card rounded-2xl p-6 shadow-apple hover:shadow-apple-lg transform transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-apple animate-pulse-geeky`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 holographic">What Users Say</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple feedback from people who use Paisa for their expense tracking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 shadow-apple-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 holographic">Ready to Start Tracking?</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Get started with Paisa today. Simple, clean, and effective expense tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-apple-lg hover:shadow-apple-xl transform hover:scale-105 transition-all duration-300 btn-glitch text-lg"
              >
                Get Started
              </button>
              <button className="px-8 py-4 glass-card text-slate-700 font-semibold rounded-2xl shadow-apple hover:shadow-apple-lg transform hover:scale-105 transition-all duration-300 text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

       {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-apple">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <span className="text-2xl font-bold holographic">Money Find</span>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</a>
                <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Support</a>
              </div>
              
              <div className="text-sm text-slate-600">
                © 2024 Paisa. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
