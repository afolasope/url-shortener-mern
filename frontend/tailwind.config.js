/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "dark-violet": 'hsl(257, 27%, 26%)',
        "cyan": 'hsl(180, 66%, 49%)',
        "very-dark-blue": 'hsl(255, 11%, 22%)',
        "very-dark-violet": 'hsl(260, 8%, 14%)',
        "grayish-violet": 'hsl(257, 7%, 63%)',
        "gray": 'hsl(0, 0%, 75%)',

      },
    },
  },
  plugins: [],
};

