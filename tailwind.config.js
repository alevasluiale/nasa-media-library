/** @type {import('tailwindcss').Config} */
module.exports = {
  // Important: This prevents Tailwind from resetting Ant Design's base styles
  corePlugins: {
    preflight: false, // This is the key line to prevent conflicts
  },
  // Don't purge ant design styles
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true, // This makes Tailwind styles take precedence when needed
  theme: {
    extend: {},
  },
  plugins: [],
};
