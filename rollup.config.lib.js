import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
const path=require('path')

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const inputPath=path.resolve(__dirname,'./src/index.js')

const outputUmdPath=path.resolve(__dirname,'./lib/tinyreact.js')
const outputEsPath=path.resolve(__dirname,'./lib/tinyreact.es.js')

export default {
	input: inputPath,
	output: {
		file: outputUmdPath,
		format: 'es',
		sourcemap: true
	},
	plugins: [
		resolve({ browser: true }),
		production && terser({
			toplevel: true
		})
	]
};
