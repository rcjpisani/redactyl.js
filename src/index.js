'use strict';

class Redactyl {
  constructor(options) {
    this.options = options || {};
    this.properties = [];
    this.text = '[REDACTED]';

    this.addProperties(this.options.properties);
    this.setText(this.options.text);
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

  redact(json) {
    let isObject = this.isObject(json);

    if (!isObject && !Array.isArray(json)) {
      throw new TypeError('A valid JSON object must be specified');
    }

    let redacted = JSON.parse(JSON.stringify(json));

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
