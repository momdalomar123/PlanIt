import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
    
  ],
   server:
  {
    host:true,
      allowedHosts:['.marshland-yearbook-bonus.ngrok-free.dev'],
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true
    },
  
  },
}})
