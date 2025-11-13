/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BetterHelp风格色彩系统
        primary: {
          DEFAULT: '#4CAF50',      // 主绿色
          dark: '#388E3C',         // 深绿色
          light: '#E8F5E9',        // 浅绿色
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F5F5F5',
          medium: '#757575',
          dark: '#212121',
        },
        functional: {
          link: '#2196F3',
          warning: '#FF9800',
          error: '#F44336',
          success: '#4CAF50',
        },
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          '思源黑体',
          'Inter',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'chat': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

