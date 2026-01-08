function mergeSplit(cy, options) {
  
  // API to be returned
  let api = {};

  // merge given component to the rest of the graph based on common nodes
  api.merge = function(component){
    let satelliteComponent = component;
    let baseComponent = cy.elements().difference(component);
    baseComponent.select();
    
    let satelliteToBaseMap = new Map();

    satelliteComponent.nodes("[label != '']").forEach(node => {
      let nodeLabel = node.data('label');
      let correspondingNode = baseComponent.nodes('[label = "' + nodeLabel + '"]')[0];
      if (correspondingNode) {
        satelliteToBaseMap.set(node.id(), correspondingNode.id()); 
      }
    });
    satelliteToBaseMap.forEach((value, key) => {
      console.log(`m[${key}] = ${value}`);
    });
  };

  return api;
}

/**
 * cytoscape-merge-split
 * An extension to merge/split graph components while respecting the existing layout
 */

function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  // Register the extension with cytoscape
  cytoscape("core", "mergeSplit", function(opts) {
    let cy = this;

    let options = {
      animate: true,
      animationDuration: 1000
    };
    
    // If opts is not 'get' that is it is a real options object then initilize the extension
    if (opts !== 'get') {
      options = extendOptions(options, opts);

      let api = mergeSplit(cy);

      setScratch(cy, 'options', options);
      setScratch(cy, 'api', api);
    }
    // Expose the API to the users
    return getScratch(cy, 'api');
  });

  // Get the whole scratchpad reserved for this extension
  function getScratch(cyOrEle, name) {
    if (cyOrEle.scratch('cyComplexityManagement') === undefined) {
      cyOrEle.scratch('cyComplexityManagement', {});
    }

    var scratch = cyOrEle.scratch('cyComplexityManagement');
    var retVal = (name === undefined) ? scratch : scratch[name];
    return retVal;
  }

  // Set a single property on scratchpad of the core
  function setScratch(cyOrEle, name, val) {
    getScratch(cyOrEle)[name] = val;
  }

  function extendOptions(options, extendBy) {
    var tempOpts = {};
    for (var key in options)
      tempOpts[key] = options[key];

    for (var key in extendBy)
      if (tempOpts.hasOwnProperty(key))
        tempOpts[key] = extendBy[key];
    return tempOpts;
  }
}

if (typeof window.cytoscape !== 'undefined') {	// expose to global cytoscape (i.e. window.cytoscape)
  register(window.cytoscape);
}

export { register as default };
