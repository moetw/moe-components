import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'moe-components.js',
    output: {
        file: 'build/moe-components.bundle.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        resolve(),
        terser({
            sourcemap: true,
            warnings: 'verbose',
        })
    ]
};