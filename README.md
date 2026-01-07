# cytoscape-merge-split

An extension to merge/split graph components while respecting the existing layout

## Installation

```bash
npm install cytoscape-merge-split
```

## Usage

```javascript
import cytoscape from 'cytoscape';
import cytoscapeMergeSplit from 'cytoscape-merge-split';

// Register the extension
cytoscapeMergeSplit(cytoscape);

// Initialize cytoscape instance
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [ /* your elements */ ]
});

// Use the extension
const api = cy.mergeSplit();

// Merge nodes
api.merge(nodes);

// Split a node
api.split(node);
```

## Building

```bash
npm install
npm run build
```

## Development

```bash
npm run watch
```
