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
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      fontSize: {
        xs: '1rem',          // 16px
        sm: '1.125rem',      // 18px
        base: '1.25rem',     // 20px
        lg: '1.5rem',        // 24px
        xl: '2rem',          // 32px
        '2xl': '2.5rem',     // 40px
        '3xl': '3rem',       // 48px
        '4xl': '3rem',     // 56px
        '5xl': '4.5rem',     // 72px
        '6xl': '6rem',       // 96px
        hero: '7rem'         // 112px
      },
      spacing: {
        section: '10rem',     // 160px
        container: '2.5rem',  // 40px
        button: '2rem'        // 32px
      },
      borderRadius: {
        lg: '1.25rem',
        xl: '1.75rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        full: '9999px'
      },
      boxShadow: {
        default: '0 8px 28px rgba(0, 0, 0, 0.08)',
        soft: '0 10px 40px rgba(0, 0, 0, 0.05)',
        strong: '0 14px 60px rgba(0, 0, 0, 0.15)'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '3.5rem',
          sm: '3rem',
          lg: '5rem',
          xl: '6rem',
          '2xl': '7rem'
        }
      }
    }
  },
  plugins: []
};
