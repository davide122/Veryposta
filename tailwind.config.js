/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#003366',
          yellow: '#FFD700',
          light: '#F9FAFB',
          dark: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Open Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Open Sans', 'sans-serif']
      },
      fontSize: {
        xs: '0.75rem',       // 12px
        sm: '0.875rem',      // 14px
        base: '1rem',        // 16px (prima era 20px)
        lg: '1.125rem',      // 18px
        xl: '1.5rem',        // 24px
        '2xl': '1.75rem',    // 28px
        '3xl': '2rem',       // 32px
        '4xl': '2.5rem',     // 40px
        '5xl': '3rem',       // 48px
        '6xl': '4rem',       // 64px
        hero: '4.5rem'         // 80px (prima 112px)
      },
      spacing: {
        section: '6rem',     // 96px (prima 160px)
        container: '1.5rem', // 24px (prima 40px)
        button: '1.5rem'     // 24px (prima 32px)
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        full: '9999px'
      },
      boxShadow: {
        default: '0 6px 20px rgba(0, 0, 0, 0.08)',
        soft: '0 8px 32px rgba(0, 0, 0, 0.05)',
        strong: '0 12px 48px rgba(0, 0, 0, 0.12)'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '2rem',
          sm: '1.5rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem'
        }
      }
    }
  },
  plugins: []
};
