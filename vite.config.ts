import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = process.cwd().replace(/\\/g, '/').replace(/^([A-Z]):/, (drive) => drive.toLowerCase())

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
})
