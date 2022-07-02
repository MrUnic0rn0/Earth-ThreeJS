import {defineConfig} from 'vite'
import vitePluginString from 'vite-plugin-string'

export default defineConfig({
  base: '/Earth-ThreeJS/',
  plugins: [vitePluginString()]
})