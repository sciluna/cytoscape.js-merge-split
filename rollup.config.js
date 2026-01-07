import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/main.js',
    output: [
      { // Node.js (CommonJS)
        file: 'dist/cytoscape-merge-split.cjs.js',
        format: 'cjs',
        exports: 'auto'
      },
      { // Direct browser use via <script>
        file: 'dist/cytoscape-merge-split.umd.js',
        format: 'umd',
        name: 'cytoscapeMergeSplit',
        globals: {
          cytoscape: 'cytoscape'
        }
      },
      { // Modern bundlers and browsers (ES Module)
        file: 'dist/cytoscape-merge-split.esm.js',
        format: 'esm'
      }
    ],
    plugins: [
      resolve()
    ],
    external: ['cytoscape']
  }
];
