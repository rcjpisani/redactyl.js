# redactyl.js
Redact sensitive information from JSON for logging (Node.js)

<p>
<a href="https://www.npmjs.com/package/redactyl.js"><img alt="npm" src="https://img.shields.io/npm/v/redactyl.js"></a>
<a href="https://www.npmjs.com/package/redactyl.js"><img alt="npm" src="https://img.shields.io/npm/dw/redactyl.js"></a>
<a href="https://codecov.io/gh/rcjpisani/redactyl.js" ><img src="https://codecov.io/gh/rcjpisani/redactyl.js/branch/master/graph/badge.svg?token=5RH52T7NXD"/></a>
<a href="https://conventionalcommits.org"><img alt="Conventional Commits" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white"/></a>
</p>

## Installation
```sh
npm install -S redactyl.js
```

## Usage
Instantiate a new instance of Redactyl, specifying the properties you wish to redact

```javascript
const Redactyl = require('redactyl.js');

let redactyl = new Redactyl({
  // Required
  'properties': [ 'apiKey', 'password', 'phone' ],

  // Optional
  'text': '[REDACTED]',
  'replacer': myCustomReplacerFunction
});
```

Optional - provide your own replacer function:

```javascript
function myReplacer(key, value) {
    ...some custom replacer logic here
}

redactyl.setReplacer(myReplacer);
```

Then run your sensitive data through the `redact` function!

```javascript
const data = {
  'apiKey': 'a1b2c3',
  'password': 'P@$$w0rd',
  'phone': 1234567890,
  'device': 'ms-7821'
};

const redacted = redactyl.redact(data);
/* Result:
{
    'apiKey': '[REDACTED]',
    'password': '[REDACTED]',
    'phone': '[REDACTED]',
    'device': 'ms-7821'
}
*/
```

### Constructor `Options` - *Object*
- `properties` - `Array` - An array of property names that should be redacted.
- `text` - `String` - Custom text to replace the redacted properties with.
- `replacer` - `Function` - Custom replacer function that alters the behavior of the [stringification process](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter|MDN)

### API
`addProperties`(`properties`)
Add the names of properties that should be redacted.

`setText`(`text`)
Set the text to replace the redacted properties with. Default: [REDACTED]

`setReplacer`(`function`)
Set the replacer function, altering the behavior of the [stringification process](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter|MDN)

`redact`(`json`)
Traverse through the specified JSON and replace *all* properties that match the property names set through the constructor options object, or the `setText` function.
