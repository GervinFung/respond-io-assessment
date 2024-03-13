import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(() => {
	const root = process.cwd();

	const server = {
		port: 3000,
		open: false,
		strictPort: true,
	} as const;

	return {
		plugins: [vue(), vueJsx(), VueDevTools()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		server,
		root: `${root}/src`,
		publicDir: `${root}/public`,
		preview: server,
		envDir: root,
		build: {
			emptyOutDir: true,
			outDir: `${root}/build`,
		},
	};
});
