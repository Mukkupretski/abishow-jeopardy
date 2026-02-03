import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {

    allowedHosts: ["subpalmated-lucilla-nontenably.ngrok-free.dev"],
    // ChatGPT
    host: true,
    port: 5173,
    hmr: {
      protocol: "wss",
      host: "subpalmated-lucilla-nontenably.ngrok-free.dev",
      clientPort: 443
    }
  }
})
