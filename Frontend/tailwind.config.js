/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Dark Navy Palette
        navy: {
          950: '#0B1020',
          900: '#0F172A', 
          800: '#111827',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
          400: '#64748B',
          300: '#94A3B8',
          200: '#CBD5E1',
          100: '#E2E8F0',
          50: '#F1F5F9'
        },
        // Electric Accents
        electric: {
          blue: '#4F8BFF',
          violet: '#7C5CFF',
          teal: '#14B8A6',
          amber: '#F59E0B',
          emerald: '#22C55E',
          rose: '#EF4444'
        },
        // Risk Colors
        risk: {
          low: '#22C55E',
          medium: '#F59E0B', 
          high: '#EF4444',
          critical: '#DC2626'
        },
        // Semantic Colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#4F8BFF',
        // Backgrounds
        background: '#0B1020',
        surface: '#111827',
        card: '#1E293B',
        border: 'rgba(255, 255, 255, 0.06)',
        // Text
        foreground: '#F1F5F9',
        muted: '#94A3B8',
        // Primary
        primary: '#4F8BFF',
        secondary: '#7C5CFF'
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0B1020 0%, #0F172A 50%, #111827 100%)',
        'gradient-electric': 'linear-gradient(135deg, #4F8BFF 0%, #7C5CFF 100%)',
        'gradient-risk': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(79, 139, 255, 0.15) 0%, transparent 70%)',
        'gradient-glow-violet': 'radial-gradient(circle at 50% 50%, rgba(124, 92, 255, 0.15) 0%, transparent 70%)',
        'gradient-glow-teal': 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 70%)'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(79, 139, 255, 0.3)',
        'glow-violet': '0 0 20px rgba(124, 92, 255, 0.3)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-risk': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px'
      },
      animation: {
        'pulse-glow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 3s ease infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    },
  },
  plugins: [],
}
