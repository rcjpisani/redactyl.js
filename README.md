# redactyl.js
Redact sensitive information from JSON for logging (Node.js)

## Installation
```sh
npm install -S redactyl.js
```

## Quick Start

### Javascript

```javascript
const Redactyl = require('redactyl.js');
let properties = [ 'apiKey', 'password', 'phone' ];
let customText = '[REDACTED]';
let redactyl = new Redactyl({
  'properties': properties,
  'text': customText
});
// OR
let redactyl = new Redactyl();
redactyl.addProperties(properties).setText(customText);

const data = {
  'apiKey': 'a1b2c3',
  'password': 'P@$$w0rd',
  'phone': 1234567890
};

const redacted = redactyl.redact(data);

console.log(redacted);
// Output:
// { apiKey: '[REDACTED]',
//  password: '[REDACTED]',
//    phone: '[REDACTED]' }
```
