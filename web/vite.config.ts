import path from "path"
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import Terminal from 'vite-plugin-terminal'

// https://vitejs.dev/config/
export default defineConfig({
	base: '',
	plugins: [
		preact(),
		Terminal()
	],
	resolve: {
		alias: [{
			// "@": path.resolve(__dirname, "./src"),
			find: "@",
			replacement: path.resolve(__dirname, "@"),
			// "@": path.resolve(__dirname, "@"),
		}],
	},
	server: {
		cors: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8765',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
});
