import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      zIndex: {
        '5': '5',
        '25': '25',
        '34': '34',
        '35': '35',
        '60': '60',
        '70': '70',
        '100': '100',
        '999': '999',
      },
      colors: {
        // Extracted from album art (approximate, can be refined)
        'ff-glass-blue': '#b6c6d6',
        'ff-fern-green': '#6e8b6e',
        'ff-cloud-white': '#f5f7fa',
        'ff-earth-brown': '#a89c8e',
        'ff-accent-yellow': '#ffe066',
        // For dark mode backgrounds
        'ff-night': '#23272e',
        // New tokens for "Break-the-Glass" module
        glass: "rgba(255,255,255,0.2)",
        accent: "#A3E4DB",
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'ff-card': '0 4px 24px 0 rgba(60, 80, 120, 0.10)',
      },
      borderRadius: {
        'ff-xl': '2rem', // Existing
        // New tokens for "Break-the-Glass" module
        xl: "1.5rem", // Note: This overrides Tailwind's default 'xl'. Consider a different name if default is needed.
        "2xl": "2rem", // Note: This matches existing 'ff-xl'. Consider if 'ff-xl' should be removed or if this is an alias.
      },
      animation: {
        'wind-pulse': 'wind-pulse 3s ease-in-out infinite',
        'float-pulse': 'float-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'wind-pulse': {
          '0%, 100%': { transform: 'scale(1) translateY(0px)' },
          '50%': { transform: 'scale(1.02) translateY(-2px)' },
        },
        'float-pulse': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '1', willChange: 'transform, opacity' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '0.8' }, // Even more movement and scale
        }
      }
    },
  },
  plugins: [
    typography,
  ],
  darkMode: 'class',
};

export default config;
