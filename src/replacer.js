'use strict';

function getReplacer() {
  // Store references to previously visited objects
  const references = new WeakSet();

  return function replacer(key, value) {
    const isObject = (typeof value) === 'object' && value !== null;
    if (isObject) {
      if (references.has(value)) {
        return '[CIRCULAR]';
      }

      references.add(value);
    }

    return value;
  };
}

module.exports = getReplacer;
