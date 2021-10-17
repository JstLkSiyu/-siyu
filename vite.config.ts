import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    port: 4444
  },
  resolve: {
    alias: [
      {
        find: /@toolbox\/(.*)/,
        replacement: path.resolve(__dirname, 'packages/toolbox/lib/$1')
      }
    ]
  },
  build: {
    lib: {
      entry: 'packages/toolbox',
      name: "@siyu/toolbox"
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  }
})
