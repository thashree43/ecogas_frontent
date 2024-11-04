/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}', 
  ],
  output: './dist/css/tailwind-output.css',
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
