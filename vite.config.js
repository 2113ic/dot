import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig((command) => {
  /** @type {import('vite').UserConfig} */
  return {
    base: '/dot/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '#': resolve(__dirname, './package'),
      },
    },
  }
})
