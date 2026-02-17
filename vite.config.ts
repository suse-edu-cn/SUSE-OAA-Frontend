import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    server: {
        port: 3011,
        proxy: {
            '/api': {
                target: 'https://api.suseoaa.com',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        assetsInlineLimit: 6144,
        rollupOptions: {
            output: {
                hashCharacters: 'hex',
                assetFileNames: '_oaa/[name]-[hash].[ext]',
                chunkFileNames: '_oaa/[name]-[hash].js',
                entryFileNames: '_oaa/[name]-[hash].js',
                minifyInternalExports: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
