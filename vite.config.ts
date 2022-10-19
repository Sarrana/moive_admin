import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            '@/assets': path.resolve(__dirname, './src/assets'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/request': path.resolve(__dirname, './src/request'),
            '@/router': path.resolve(__dirname, './src/router'),
            '@/type': path.resolve(__dirname, './src/type')
        }
    },
    server: {
        port: 10085
    },
    build: {
        sourcemap: true
    }
})
