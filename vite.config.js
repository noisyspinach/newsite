import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { mdsvex } from 'mdsvex';

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md'],

			preprocess: [
				mdsvex({
					extensions: ['.md']
				})
			],

			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules')
						? undefined
						: true
			},

			adapter: adapter()
		})
	]
});

