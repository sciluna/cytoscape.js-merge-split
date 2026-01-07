import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/main.js',
    output: [
      {
        file: 'dist/cytoscape-merge-split.js',
        format: 'umd',
        name: 'cytoscapeMergeSplit',
        globals: {
          cytoscape: 'cytoscape'
        }
      },
      {
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
