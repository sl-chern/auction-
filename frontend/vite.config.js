import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import babel from 'vite-plugin-babel'

export default defineConfig({
  plugins: [react(), eslint(), babel()],
})
