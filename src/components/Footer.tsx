import { useNavigate } from 'react-router-dom'

interface FooterProps {
  variant?: 'landing' | 'auth'
}

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

export default function Footer({ variant = 'landing' }: FooterProps) {
  const navigate = useNavigate()

  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Dashboard', href: '/dashboard' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
        { label: 'Blog', href: '#blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Documentation', href: '#docs' },
        { label: 'API', href: '#api' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' }
      ]
    }
  ]

  const socialLinks = [
    { label: 'GitHub', href: '#github', icon: '⚡' },
    { label: 'Twitter', href: '#twitter', icon: '🐦' },
    { label: 'LinkedIn', href: '#linkedin', icon: '💼' }
  ]

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      // For anchor links, try to scroll to section or navigate
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`/${href}`)
      }
    } else {
      navigate(href)
    }
  }

  // Simplified footer for auth pages
  if (variant === 'auth') {
    return (
      <footer className="relative z-10 px-6 py-8 border-t border-white/20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Logo */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-apple">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
                <span className="text-xl font-bold holographic">Money Find</span>
              </button>
              
              {/* Quick Links */}
              <div className="flex items-center gap-6 text-sm">
                <button
                  onClick={() => handleLinkClick('#privacy')}
                  className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  Privacy
                </button>
                <button
                  onClick={() => handleLinkClick('#terms')}
                  className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  Terms
                </button>
                <button
                  onClick={() => handleLinkClick('#help')}
                  className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  Help
                </button>
              </div>
              
              {/* Copyright */}
              <div className="text-sm text-slate-600">
                © 2024 Money Find. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Full footer for landing page
  return (
    <footer className="relative z-10 px-6 py-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 mb-4 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-apple">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <span className="text-2xl font-bold holographic">Money Find</span>
              </button>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Simple, clean, and effective expense tracking for everyone. 
                Built with modern technologies for the best user experience.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <button
                    key={social.label}
                    onClick={() => handleLinkClick(social.href)}
                    className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-lg hover:shadow-apple-lg transform hover:scale-105 transition-all duration-200"
                    title={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-slate-800 mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200/50">
            <div className="text-sm text-slate-600">
              © 2024 Money Find. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span>Made with ❤️ using React & TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
