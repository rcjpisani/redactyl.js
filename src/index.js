'use strict';

const getReplacer = require('./replacer');

class Redactyl {
  constructor (options) {
    this.options = options || {};
    this.properties = [];
    this.text = '[REDACTED]';
    this.replacer = getReplacer();

    this.addProperties(this.options.properties);
    this.setText(this.options.text);

    if (this.options.replacer)
      this.setReplacer(this.options.replacer);
  }

  addProperties(properties) {
    if (!properties || !Array.isArray(properties)) {
      return this;
    }

    for (let p of properties) {
      if (this.properties.includes(p)) continue;

      this.properties.push(p);
    }

    return this;
  }

  isObject(property) {
    return (typeof property) === 'object' && !Array.isArray(property) && property !== null;
  }

  setText(text) {
    if ((typeof text) !== 'string') return this;

    this.text = text;
    return this;
  }

  setReplacer(fn) {
    if ((typeof fn) !== 'function') {
      throw new TypeError('Using a custom replacer expects a function to be passed');
    }

    this.replacer = fn;
    return this;
  }

  redact(json) {
    const isObject = this.isObject(json);

    if (!isObject && !Array.isArray(json)) {
      return json;
    }

    const redacted = JSON.parse(JSON.stringify(json, this.replacer));

    for (let prop in redacted) {
      if (this.properties.includes(prop)) {
        redacted[prop] = this.text;
      }

      if (Array.isArray(redacted[prop])) {
        redacted[prop].forEach((value, index) => {
          redacted[prop][index] = this.redact(value);
        });
      } else if (this.isObject(redacted[prop])) {
        redacted[prop] = this.redact(redacted[prop]);
      }
    }

    return redacted;
  }
}

module.exports = exports = Redactyl;
