import {terser} from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: './src/moe-components.js',
    output: {
        file: 'build/moe-components.bundle.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        terser({
            sourcemap: true,
            warnings: 'verbose',
        })
    ]
};