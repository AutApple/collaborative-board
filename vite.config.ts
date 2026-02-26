import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = __dirname; // project root

export default defineConfig({
	root: 'public',
	build: {
		outDir: path.resolve(ROOT, 'public-dist'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: path.resolve(ROOT, 'public/index.html'),
				createBoard: path.resolve(ROOT, 'public/create-board.html'),
				app: path.resolve(ROOT, 'public/app.html'),
				notFound: path.resolve(__dirname, 'public/404.html'),
				signUp: path.resolve(__dirname, 'public/sign-up.html'),
				logout: path.resolve(__dirname, 'public/logout.html'),
			},
		},
	},
	resolve: {
		alias: {
			'@shared': path.resolve(ROOT, 'shared'),
		},
	},
});
