/**
 * cytoscape-merge-split
 * An extension to merge/split graph components while respecting the existing layout
 */

const register = function(cytoscape) {
  if (!cytoscape) {
    return;
  }

  // Extension implementation
  const mergeSplit = function(options) {
    const cy = this;
    const defaults = {
      // Default options can be added here
    };

    const opts = Object.assign({}, defaults, options);

    // Extension methods
    return {
      merge: function(nodes) {
        // Merge functionality to be implemented
        console.log('Merge function called with nodes:', nodes);
        return cy;
      },
      split: function(node) {
        // Split functionality to be implemented
        console.log('Split function called with node:', node);
        return cy;
      }
    };
  };

  // Register the extension with cytoscape
  cytoscape('core', 'mergeSplit', mergeSplit);
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = register;
}

export default register;
