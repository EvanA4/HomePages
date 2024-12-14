/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

