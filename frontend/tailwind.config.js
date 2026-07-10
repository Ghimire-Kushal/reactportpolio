import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease both',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          bg:      '#0d0e1a',
          card:    '#13142a',
          border:  '#1e2040',
          muted:   '#1a1c35',
        },
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50:  '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              DEFAULT: '#4f46e5',
              foreground: '#ffffff',
            },
          },
        },
        dark: {
          colors: {
            background: '#0d0e1a',
            content1: '#13142a',
            content2: '#1a1c35',
            divider: '#1e2040',
            primary: {
              50:  '#312e81',
              100: '#3730a3',
              200: '#4338ca',
              300: '#4f46e5',
              400: '#6366f1',
              500: '#818cf8',
              600: '#a5b4fc',
              700: '#c7d2fe',
              800: '#e0e7ff',
              900: '#eef2ff',
              DEFAULT: '#818cf8',
              foreground: '#0d0e1a',
            },
          },
        },
      },
    }),
  ],
}
