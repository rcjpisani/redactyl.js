# redactyl.js
Redact sensitive information from JSON for logging (Node.js)

## Installation
```sh
npm install -S redactyl.js
```

## Quick Start
Instantiate a new instance of Redactyl, specifying the properties you wish to redact
```javascript
const Redactyl = require('redactyl.js');

let redactyl = new Redactyl({
  'properties': [ 'apiKey', 'password', 'phone' ]
});
```
Then run your sensitive data through the `redact` function!
```javascript
const data = {
  'apiKey': 'a1b2c3',
  'password': 'P@$$w0rd',
  'phone': 1234567890
};

const redacted = redactyl.redact(data);
/* Result:
{
    'apiKey': '[REDACTED]',
    'password': '[REDACTED]',
    'phone': '[REDACTED]'
}
*/
```

### Constructor Options - *Object*
- `properties` - `Array` - An array of property names that should be redacted.
- `text` - `String` - Custom text to replace the redacted properties with.

### API
`addProperties`(`properties`)
Add the names of properties that should be redacted.

`setText`(`text`)
Set the text to replace the redacted properties with. Default: [REDACTED]

`redact`(`json`)
Traverse through the specified JSON and replace *all* properties that match the property names set through the constructor options object, or the `setText` function.
