import helper from "./auxiliary/helper.js";
import SVD from "./auxiliary/SVD.js"

export function mergeSplit(cy, options) {
  
  // API to be returned
  let api = {};

  // merge given component1 to component2 based on common nodes
  api.merge = function(sourceComponent, targetComponent){
    
    // find common nodes and edges
    let sourceToTargetMap = new Map();
    // construct common nodes map based on matched nodes
    sourceComponent.nodes().forEach(node1 => {
      targetComponent.nodes().forEach(node2 => {
        if(options.nodeMatcher(node1, node2)) {
          sourceToTargetMap.set(node1.id(), node2.id()); 
        }
      });
    });

    cy.style()
      .selector('node.commonNode')
        .style({
          'background-color': '#ff0000'
        }).update();  

    sourceToTargetMap.forEach((value, key) => {
      cy.getElementById(key).addClass("commonNode");
      cy.getElementById(value).addClass("commonNode");
    });

    // calculate transformation matrix
    let transformationMatrix;

    if (sourceToTargetMap.size == 1) {  // there is one common node, so check overlap of current and reflected versions
      const targetBB = targetComponent.boundingBox({ includeLabels: false, includeOverlays: false });
      const transforms = [
        { name: "identity", fn: (x, y, cx, cy) => ({ x, y }) },
        { name: "flipX", fn: (x, y, cx, cy) => ({ x, y: 2*cy - y }) },
        { name: "flipY", fn: (x, y, cx, cy) => ({ x: 2*cx - x, y }) }
      ];
      const mapItem = sourceToTargetMap.entries().next().value;
      const sourceNode = cy.getElementById(mapItem[0]);
      const targetNode = cy.getElementById(mapItem[1]);
      const shiftAmount = {x: targetNode.position().x - sourceNode.position().x, y: targetNode.position().y - sourceNode.position().y};

      let best = Infinity;
      let bestTransform = null;

      for (const t of transforms) {
        const score = scoreTransform(sourceComponent.nodes(), targetBB, t.fn, shiftAmount, sourceNode);

        if (score < best) {
          best = score;
          bestTransform = t.name;
        }
      }
      if (bestTransform == "identity") {
        transformationMatrix = [[1, 0], [0, 1]];
      } else if (bestTransform == "flipX"){
        transformationMatrix = [[1, 0], [0, -1]];
      } else {
        transformationMatrix = [[-1, 0], [0, 1]];
      }
      console.log(bestTransform);
    } else {  // common nodes are more than one
      transformationMatrix = calcTransformationMatrix(sourceToTargetMap);
    }

    let sourceBBox = sourceComponent.boundingBox({includeLabels: false, includeOverlays: false});
    let sourceBBoxCenter = {x: sourceBBox.x1 + sourceBBox.w / 2, y: sourceBBox.y1 + sourceBBox.h / 2};

    let transformationResult = [];
    /* apply found transformation matrix to sourceBBox component */
    for (let i = 0; i < sourceComponent.nodes().length; i++) {
      let node = sourceComponent.nodes()[i];
      let nodePosition = node.position();
      let localX = nodePosition.x - sourceBBoxCenter.x;
      let localY = nodePosition.y - sourceBBoxCenter.y;
      let temp1 = [localX, localY];
      let temp2 = [transformationMatrix[0][0], transformationMatrix[1][0]];
      let temp3 = [transformationMatrix[0][1], transformationMatrix[1][1]];
      transformationResult.push({x: helper.dotProduct(temp1, temp2) + sourceBBoxCenter.x, y: helper.dotProduct(temp1, temp3) + sourceBBoxCenter.y});
    }

    let aniArray = [];
    for (let i = 0; i < sourceComponent.nodes().length; i++) {
      let node = sourceComponent.nodes()[i];
      let nodeAni = node.animation({
        position: transformationResult[i],
        queue: true
      }, {
        duration: options.animationDuration
      });
      aniArray.push(nodeAni);
    }

    setTimeout(function(){
      aniArray.forEach(ani => {
        ani.play();
      });
    }, 100);

    // expant target component
    let ani3Array = [];
    setTimeout(function(){
      ani3Array = expandTarget(targetComponent, sourceComponent, sourceToTargetMap, options);
      ani3Array[0].forEach(ani => {
        ani.play();
      });
    }, 4000);

    setTimeout(function(){
      ani3Array[1].forEach(ani => {
        ani.play();
      });
    }, 6000);

    // merge source component to target
    setTimeout(function(){
      integrateSourceBBoxToTarget(sourceToTargetMap);
    }, 8000); 

  };

  // split function - splits given component from the rest of the graph
  api.split = function(component, keepBoundaryEles = true, direction = "auto", offset = 100) {
    let restOfGraph = cy.elements().difference(component);

    let splittedComponent = cy.collection();
    let boundaryNodes = undefined;
    let edgesToRemove = undefined;
    // keep boundary elements
    if (keepBoundaryEles) {
      // find the nodes that need to be split
      boundaryNodes = component.nodes().filter(node => {
        let filter = false;
        let edgesConnectedToBoundary = node.edgesWith(restOfGraph);
        if(edgesConnectedToBoundary.length > 0) {
          filter = true;
        }
        return filter;
      });

      let boundaryNodesJsons = boundaryNodes.jsons();
      let { jsons: clonedNodesJsons, oldIdToNewId} = cloneNodes(boundaryNodesJsons);

      let clonedNodes = cy.collection();
      cy.batch(function () {
          clonedNodes = cy.add(clonedNodesJsons);
          //clonedNodes.select();
      });
      // process edges between boundary nodes and given separated component
      // cloned nodes and edges stay on separated component side
      let edgesToEvaluate = boundaryNodes.edgesWith(component);
      let boundaryEdges = cy.collection();
      let clonedEdges = cy.collection();
      edgesToEvaluate.forEach(edge => {
        if(oldIdToNewId[edge.source().id()] && !oldIdToNewId[edge.target().id()]) {
          edge.move({
            source: oldIdToNewId[edge.source().id()]
          });
        }
        if(oldIdToNewId[edge.target().id()] && !oldIdToNewId[edge.source().id()]) {
          edge.move({
            target: oldIdToNewId[edge.target().id()]
          });
        }
        if(oldIdToNewId[edge.source().id()] && oldIdToNewId[edge.target().id()]) {
          let boundaryEdgesJsons = edge.jsons(); // we process a single edge, but cloneEdges function gets jsons
          let result = cloneEdges(boundaryEdgesJsons, oldIdToNewId);
          let clonedEdgeJson = result.jsons[0];
          let clonedEdge = cy.add(clonedEdgeJson);
          boundaryEdges.merge(edge);
          clonedEdges.merge(clonedEdge);     
        }
      });

      splittedComponent = cy.collection().merge(component.not(boundaryNodes).not(boundaryEdges)).merge(clonedNodes).merge(clonedEdges);
      // cy.elements().not(splittedComponent).unselect();
    } else {	// ignore boundary nodes
      edgesToRemove = component.edgesWith(restOfGraph);
      splittedComponent.merge(component.not(edgesToRemove));
      edgesToRemove.remove();
      //console.log(splittedComponent);
    }

    if(direction != "none") {
      // calculate overall shift amount
      let shiftAmountX = 0;
      let shiftAmountY = 0;
      let splittedBBox = splittedComponent.boundingBox();
      let restBBox;
      if (splittedComponent.parent() && splittedComponent.parent().length > 0) { // we may need to find topMostParent here
        restBBox = splittedComponent.parent()[0].descendants().not(splittedComponent).boundingBox();
      } else {
        restBBox = restOfGraph.boundingBox();
      }
      // if auto, then decide split direction based on distance from center of restOfGraph - longer is better
      if (direction == "auto") { 
        let diffInX = (restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
        let diffInY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);
        if (Math.abs(diffInX) > Math.abs(diffInY)) {
          if (diffInX >= 0) {
            direction = "left";
          } else {
            direction = "right";
          }
        } else {
           if (diffInY >= 0) {
            direction = "up";
          } else {
            direction = "down";
          }         
        }
      } 
      if (direction == "left") {
        shiftAmountX = (restBBox.x1 - splittedBBox.w / 2 - offset) - (splittedBBox.x1 + splittedBBox.w / 2);
        shiftAmountY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);
      } else if (direction == "right") {
        shiftAmountX = (restBBox.x1 + restBBox.w + splittedBBox.w / 2 + offset) - (splittedBBox.x1 + splittedBBox.w / 2);
        shiftAmountY = (restBBox.y1 + restBBox.h / 2) - (splittedBBox.y1 + splittedBBox.h / 2);        
      } else if (direction == "up") {
        shiftAmountX =(restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
        shiftAmountY = (restBBox.y1 - splittedBBox.h / 2 - offset) - (splittedBBox.y1 + splittedBBox.h / 2);
      } else if (direction == "down") {
        shiftAmountX =(restBBox.x1 + restBBox.w / 2) - (splittedBBox.x1 + splittedBBox.w / 2);
        shiftAmountY = (restBBox.y1 + restBBox.h + splittedBBox.h / 2 + offset) - (splittedBBox.y1 + splittedBBox.h / 2);
      }
      if(options.animate) { // animate nodes to calculated position
        splittedComponent.nodes().forEach(node => {
          node.animate({
            position: ({x: node.position().x + shiftAmountX, y: node.position().y + shiftAmountY}),
            duration: options.animationDuration
          });
        });
      } else { // move nodes to calculated position without animation
        splittedComponent.nodes().shift({ x: shiftAmountX, y: shiftAmountY }); 
      }
    }

    return splittedComponent;
  };

  return api;
}

// computes bounding box for given node positions by not considering node dimensions
function computeBB(transformed) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  transformed.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  return { x1: minX, y1: minY, x2: maxX, y2: maxY };
}

// calculates intersection area
function intersectionArea(a, b) {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);

  if (x2 <= x1 || y2 <= y1) return 0;

  return (x2 - x1) * (y2 - y1);
}

// returns intersection area for given transformation and shift
function scoreTransform(sourceNodes, targetBB, transformFn, anchorShift, anchorNode) {
  const { x: cx, y: cy } = anchorNode.position();
  let transformed = sourceNodes.map(n => {
    let { x, y } = n.position();

    ({ x, y } = transformFn(x, y, cx, cy));

    return {
      x: x + anchorShift.x,
      y: y + anchorShift.y
    };
  });

  const bb = computeBB(transformed);

  return intersectionArea(bb, targetBB);
}

// given sourceToTargetMap which contains mapping between common nodes in both components
// calculate transformation matrix
function calcTransformationMatrix (sourceToTargetMap) {
  // construct source and target configurations
  let targetMatrix = []; // A - target configuration
  let sourceMatrix = []; // B - source configuration 

  sourceToTargetMap.forEach((value, key) => {
    let targetPosition = cy.getElementById(value).position();
    targetMatrix.push([targetPosition.x, targetPosition.y]);

    let sourcePosition = cy.getElementById(key).position();
    sourceMatrix.push([sourcePosition.x, sourcePosition.y]);
  });

  // calculate transformation matrix
  let transformationMatrix;
  let targetMatrixTranspose = helper.transpose(targetMatrix);  // A'
  let sourceMatrixTranspose = helper.transpose(sourceMatrix);  // B'

  // centralize transpose matrices
  for (let i = 0; i < targetMatrixTranspose.length; i++) {
    targetMatrixTranspose[i] = helper.multGamma(targetMatrixTranspose[i]);
    sourceMatrixTranspose[i] = helper.multGamma(sourceMatrixTranspose[i]);
  }

  // do actual calculation for transformation matrix
  let tempMatrix = helper.multMat(targetMatrixTranspose, helper.transpose(sourceMatrixTranspose)); // tempMatrix = A'B
  let SVDResult = SVD.svd(tempMatrix); // SVD(A'B) = USV', svd function returns U, S and V 
  transformationMatrix = helper.multMat(SVDResult.V, helper.transpose(SVDResult.U)); // transformationMatrix = T = VU'

  // to prevent floating-point precision errors 
  transformationMatrix = transformationMatrix.map(inner =>
    inner.map(n => Number(n.toFixed(1)))
  );

  return transformationMatrix;
}

function expandTarget(targetComponent, sourceComponent, sourceToTargetMap, options) {
  let targetCommonNodeSet = cy.collection();
  let sourceBBoxCommonNodeSet = cy.collection();
  sourceToTargetMap.forEach((value, key) => {
    targetCommonNodeSet.merge(cy.getElementById(value));
    sourceBBoxCommonNodeSet.merge(cy.getElementById(key));
  });

  let bbTargetCommon = targetCommonNodeSet.boundingBox({includeLabels: false, includeOverlays: false});
  let bbsourceBBoxCommon = sourceBBoxCommonNodeSet.boundingBox({includeLabels: false, includeOverlays: false});
  let bbDiff = {x: (bbTargetCommon.x1 + bbTargetCommon.w / 2) - (bbsourceBBoxCommon.x1 + bbsourceBBoxCommon.w / 2), y: (bbTargetCommon.y1 + bbTargetCommon.h / 2) - (bbsourceBBoxCommon.y1 + bbsourceBBoxCommon.h / 2)};

  sourceBBoxCommonNodeSet.forEach(node => {
    node.scratch('position', {x: node.position().x + bbDiff.x, y: node.position().y + bbDiff.y});
  });

  let minXNode, maxXNode, minYNode, maxYNode = 0;
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  sourceBBoxCommonNodeSet.forEach((node, i) => {
    let nodeTempPos = node.scratch('position');
    if(nodeTempPos.x < minX) {
      minXNode = node;
      minX = nodeTempPos.x;
    }
    if(nodeTempPos.x > maxX) {
      maxXNode = node;
      maxX = nodeTempPos.x;
    }
    if(nodeTempPos.y < minY) {
      minYNode = node;
      minY = nodeTempPos.y;
    }
    if(nodeTempPos.y > maxY) {
      maxYNode = node;
      maxY = nodeTempPos.y;
    }
  });
  
  let upShiftAmount = cy.getElementById(sourceToTargetMap.get(minYNode.id())).position().y - minY;
  let downShiftAmount = maxY - cy.getElementById(sourceToTargetMap.get(maxYNode.id())).position().y;
  let leftShiftAmount = cy.getElementById(sourceToTargetMap.get(minXNode.id())).position().x - minX;
  let rightShiftAmount = maxX - cy.getElementById(sourceToTargetMap.get(maxXNode.id())).position().x;

  targetComponent.nodes().forEach(node => {
    node.scratch('newPosition', {x: node.position().x, y: node.position().y});
    if(node.position().y <= cy.getElementById(sourceToTargetMap.get(minYNode.id())).position().y) {
      node.scratch('newPosition', {x: node.scratch('newPosition').x, y: node.scratch('newPosition').y - upShiftAmount});
    }
    if(node.position().y >= cy.getElementById(sourceToTargetMap.get(maxYNode.id())).position().y) {
      node.scratch('newPosition', {x: node.scratch('newPosition').x, y: node.scratch('newPosition').y + downShiftAmount});
    }
    if(node.position().x <= cy.getElementById(sourceToTargetMap.get(minXNode.id())).position().x) {
      node.scratch('newPosition', {x: node.scratch('newPosition').x - leftShiftAmount, y: node.scratch('newPosition').y});
    }
    if(node.position().x >= cy.getElementById(sourceToTargetMap.get(maxXNode.id())).position().x) {
      node.scratch('newPosition', {x: node.scratch('newPosition').x + rightShiftAmount, y: node.scratch('newPosition').y});
    }
  });

  let animations1 = [];
  targetComponent.nodes().forEach(node => {
    let ani = node.animation({
      position: node.scratch('newPosition'),
      queue: true
    }, {
      duration: options.animationDuration
    });
    animations1.push(ani);
  });

  let animations2 = [];
  sourceComponent.nodes().forEach(node => {
    let ani = node.animation({
      position: {x: node.position().x + bbDiff.x, y: node.position().y + bbDiff.y},
      queue: true
    }, {
      duration: options.animationDuration
    });
    animations2.push(ani);    
  });
  return [animations1, animations2];
}

function integrateSourceBBoxToTarget(sourceToTargetMap) {
  sourceToTargetMap.forEach((value, key) => {
    let sourceBBoxNode = cy.getElementById(key);
    let targetNode = cy.getElementById(value);
    sourceBBoxNode.incomers().edges().forEach(edge => {
      if(!(sourceToTargetMap.get(edge.source().id()) && sourceToTargetMap.get(edge.target().id()) && cy.getElementById(sourceToTargetMap.get(edge.source().id())).edgesTo(cy.getElementById(sourceToTargetMap.get(edge.target().id())).length != 0))){
        edge.move({
          target: value
        });
      }
    });
    sourceBBoxNode.outgoers().edges().forEach(edge => {
      if(!(sourceToTargetMap.get(edge.source().id()) && sourceToTargetMap.get(edge.target().id()) && cy.getElementById(sourceToTargetMap.get(edge.source().id())).edgesTo(cy.getElementById(sourceToTargetMap.get(edge.target().id())).length != 0))){
        edge.move({
          source: value
        });
      }
    });
    sourceBBoxNode.remove();	// remove dangling node
  });
  cy.elements().unselect();
  //setTimeout(function(){
    sourceToTargetMap.forEach((value, key) => {
      cy.getElementById(value).removeClass("commonNode");
    });
  //}, 500); 
}

function cloneNodes(jsons) {
  jsons = structuredClone(jsons);

  let oldIdToNewId = {};
  for (let i = 0; i < jsons.length; i++) {
      let json = jsons[i];

      // change id of the cloned node
      let id = getCloneId("node");
      oldIdToNewId[json.data.id] = id;
      json.data.id = id;

      // change parent reference of the cloned node if parent is also cloned
      if (json.data["parent"] && oldIdToNewId[json.data["parent"]]) {
        json.data["parent"] = oldIdToNewId[json.data["parent"]];
      }
  }
  return {jsons, oldIdToNewId}; 
}

function cloneEdges(jsons, oldIdToNewId) {
  jsons = structuredClone(jsons);

  for (let i = 0; i < jsons.length; i++) {
      let json = jsons[i];

      // change id of the cloned edge
      let id = getCloneId("edge");
      oldIdToNewId[json.data.id] = id;
      json.data.id = id;

      const fields = ['source', 'target'];
      // change source/target references of the cloned edge (source and target must also be cloned)
      for (let k = 0; k < fields.length; k++) {
        let field = fields[k];
        if (json.data[field] && oldIdToNewId[json.data[field]])
            json.data[field] = oldIdToNewId[json.data[field]];
      }
  }
  return {jsons, oldIdToNewId}; 
}

function getCloneId(eleType) {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }

  let cloneIdTemp = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  if (eleType == "node") {
    return 'n' + cloneIdTemp;
  } else if(eleType == "edge") {
    return 'e' + cloneIdTemp;
  } else {
    return cloneIdTemp;
  }

}