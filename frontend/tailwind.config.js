/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic Colors mapped to CSS Variables
                void: 'var(--bg-primary)', // Main background
                'void-light': 'var(--glass-bg)', // Panel background
                primary: {
                    DEFAULT: 'var(--accent-primary)',
                    50: 'var(--accent-primary)',
                    100: 'var(--accent-primary)',
                    200: 'var(--accent-primary)',
                    300: 'var(--accent-primary)',
                    400: 'var(--accent-primary)', // Used in card
                    500: 'var(--accent-primary)', // Used in generic
                    600: 'var(--accent-primary)',
                    700: 'var(--accent-primary)',
                    800: 'var(--accent-primary)',
                    900: 'var(--accent-primary)', // Used in backgrounds
                },
                // Text aliases
                'text-main': 'var(--text-primary)',
                'text-muted': 'var(--text-secondary)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-inst',
                'slide-up': 'slideUp 0.6s ease-out',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
