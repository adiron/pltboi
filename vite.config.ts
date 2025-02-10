import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - Child process should work, this is a config thing
import { execSync } from 'child_process'


const commitHash = execSync('git rev-parse --short HEAD')
    .toString();

// https://vite.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
