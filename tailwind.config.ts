import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Definisikan font-sans untuk menggunakan Space Grotesk
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        // Definisikan font-serif untuk menggunakan Crimson Pro
        serif: ['var(--font-crimson-pro)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
