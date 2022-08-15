import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import transformJsx2h from './rollup.plugin.transformer';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'example/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		transformJsx2h(),
		resolve(),
		commonjs()
	]
};
