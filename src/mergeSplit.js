export function mergeSplit(cy, options) {
  
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