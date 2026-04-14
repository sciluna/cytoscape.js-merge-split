# cytoscape-merge-split (under development)

## Description
This extension adds support for merging/splitting graph components while respecting the existing layout.

Click [here](https://sciluna.github.io/cytoscape.js-merge-split/demo.html) for a demo.

## API

`cy.mergeSplit(options)`
To initialize the extension with given options.

`let api = cy.mergeSplit('get')`
To get the extension instance after initialization.

`api.merge(sourceComponent, targetComponent)`
Merge source component to target component.

`api.split(component, keepBoundaryEles = true, direction = "auto", offset = 100)`
Split the given component from the rest of the graph.

`api.setOption(optionName, optionValue)`
Change the given option with the given value.

## Default Options
```javascript
    var options = {
      animate: true, // whether to animate during merge/split operations
      animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
      nodeMatcher: (n1, n2) => {  // n1 from source component, n2 from target component
        // check if labels match
        return !!(n1.data('label') && n1.data('label') != '' && n2.data('label') &&
          n2.data('label') != '' && n1.data('label') === n2.data('label'));
      },
      edgeMatcher: (e1, e2) => {  // e1 from source component, e2 from target component
        // check if source and target labels match
        return e1.source().data('label') === e2.source().data('label') &&
          e1.target().data('label') === e2.target().data('label');
      }
    };
```
## Dependencies
 * Cytoscape.js ^3.3.0

## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-merge-split`,
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:
```js
import cytoscape from 'cytoscape';
import mergeSplit from 'cytoscape-merge-split';

cytoscape.use( mergeSplit );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let mergeSplit = require('cytoscape-merge-split');

cytoscape.use( mergeSplit ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-merge-split'], function( cytoscape, mergeSplit ){
  mergeSplit( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.

## Publishing instructions

This project is set up to automatically be published to npm.  To publish:

1. Build the extension : `npm run build`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. [Make a new release](https://github.com/hasanbalci/cytoscape.js-transform/releases/new) for Zenodo.
