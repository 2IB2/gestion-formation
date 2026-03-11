import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const strictCsp =
    process.env.VITE_STRICT_CSP === '1' ||
    process.env.VITE_STRICT_CSP === 'true'

  return {
    plugins: [react({ fastRefresh: !strictCsp })],
    server: strictCsp ? { hmr: false } : undefined,
  }
})
