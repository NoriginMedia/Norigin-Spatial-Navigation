/* eslint-disable import/no-extraneous-dependencies */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

const baseConfig = {
  external: [
    '@noriginmedia/norigin-spatial-navigation-core',
    '@noriginmedia/norigin-spatial-navigation-react',
    'lodash-es',
    'react',
    'react-native'
  ],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })]
};

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.mjs', format: 'es' },
      { file: 'dist/index.cjs', format: 'cjs' }
    ],
    ...baseConfig
  },
  {
    input: 'src/index.web.ts',
    output: [
      { file: 'dist/index.web.mjs', format: 'es' },
      { file: 'dist/index.web.cjs', format: 'cjs' }
    ],
    ...baseConfig
  }
]);
