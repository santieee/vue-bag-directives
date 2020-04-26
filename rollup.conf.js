import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [
    nodeResolve(),
    babel(),
  ],
  output: [
    {
      format: 'umd',
      name: 'VueKit',
      exports: 'named',
      file: 'dist/index.js',
    }
  ],
}