'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Redactyl = require('..');
const getReplacer = require('../src/replacer');

const DEFAULT_TEXT = '[REDACTED]';
const CUSTOM_TEXT = '[SECURED]';
const REPLACER_ERROR = 'Using a custom replacer expects a function to be passed';
const CIRCULAR_TEXT = '[CIRCULAR]';

describe('Redactyl test suite', function () {
  it('Should export the module', async function () {
    expect(typeof Redactyl).to.equal('function');
    expect(Redactyl.name).to.equal('Redactyl');
  });

  it('Should add properties from the configuration option', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });

    expect(Array.isArray(redactyl.properties)).to.equal(true);
    expect(redactyl.properties.length).to.equal(properties.length);

    properties.forEach((p) => {
      expect(redactyl.properties.includes(p)).to.equal(true);
    });
  });

  it('Should add properties from the addProperties function', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl();
    redactyl.addProperties(properties);

    expect(Array.isArray(redactyl.properties)).to.equal(true);
    expect(redactyl.properties.length).to.equal(properties.length);

    properties.forEach((p) => {
      expect(redactyl.properties.includes(p)).to.equal(true);
    });
  });

  it('Should add custom redacted text from the configuration option', async function () {
    let redactyl = new Redactyl({ 'text': CUSTOM_TEXT });

    expect(redactyl.text).to.equal(CUSTOM_TEXT);
  });

  it('Should add custom redacted text from the setText function', async function () {
    let redactyl = new Redactyl();
    redactyl.setText(CUSTOM_TEXT);

    expect(redactyl.text).to.equal(CUSTOM_TEXT);
  });

  it('Should chain add properties and custom text', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl();
    redactyl.addProperties(properties).setText(CUSTOM_TEXT);

    expect(Array.isArray(redactyl.properties)).to.equal(true);
    expect(redactyl.properties.length).to.equal(properties.length);

    properties.forEach((p) => {
      expect(redactyl.properties.includes(p)).to.equal(true);
    });

    expect(redactyl.text).to.equal(CUSTOM_TEXT);

    // Try in the opposite order
    redactyl.setText(CUSTOM_TEXT).addProperties(properties);

    expect(Array.isArray(redactyl.properties)).to.equal(true);
    expect(redactyl.properties.length).to.equal(properties.length);

    properties.forEach((p) => {
      expect(redactyl.properties.includes(p)).to.equal(true);
    });

    expect(redactyl.text).to.equal(CUSTOM_TEXT);
  });

  it('Should not redact any properties, invalid JSON', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });

    let error = null;
    try {
      redactyl.redact('invalid');
    } catch (err) {
      error = err;
    }

    expect(error).to.not.equal(null);
    expect(error.constructor.name).to.equal('TypeError');
  });

  it('Should redact shallow JSON', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    let json = {
      'apiKey': 'a1b2c3',
      'password': 'P@$$w0rd',
      'phone': 1234567890
    };

    let redacted = redactyl.redact(json);

    expect(redactyl.redact.calledOnce).to.equal(true);
    expect(typeof redacted).to.equal('object');
    for (let prop in redacted) {
      expect(redacted[prop]).to.equal(DEFAULT_TEXT);
    }
  });

  it('Should redact shallow JSON with an array', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    let json = {
      'arr': [ {
        'apiKey': 'a1b2c3',
        'password': 'P@$$w0rd',
        'phone': 1234567890
      } ]
    };

    let redacted = redactyl.redact(json);

    expect(redactyl.redact.calledTwice).to.equal(true);
    expect(typeof redacted).to.equal('object');
    for (let prop in redacted.arr[0]) {
      expect(redacted.arr[0][prop]).to.equal(DEFAULT_TEXT);
    }
  });

  it('Should redact shallow JSON with a nested array', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    let json = {
      'arr': [
        {
          'apiKey': 'a1b2c3',
          'password': 'P@$$w0rd',
          'phone': 1234567890
        },
        [
          {
            'apiKey': 'a1b2c3',
            'password': 'P@$$w0rd',
            'phone': 1234567890
          }
        ]
      ]
    };

    let redacted = redactyl.redact(json);

    // expect(redactyl.redact.callCount).to.equal(4);
    expect(typeof redacted).to.equal('object');
    for (let prop in redacted.arr[0]) {
      expect(redacted.arr[0][prop]).to.equal(DEFAULT_TEXT);
    }
    for (let prop in redacted.arr[1][0]) {
      expect(redacted.arr[1][0][prop]).to.equal(DEFAULT_TEXT);
    }
  });

  it('Should redact shallow JSON with an array', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    let json = {
      'arr': [{
        'apiKey': 'a1b2c3',
        'password': 'P@$$w0rd',
        'phone': 1234567890
      }]
    };

    let redacted = redactyl.redact(json);

    expect(redactyl.redact.calledTwice).to.equal(true);
    expect(typeof redacted).to.equal('object');
    for (let prop in redacted.arr[0]) {
      expect(redacted.arr[0][prop]).to.equal(DEFAULT_TEXT);
    }
  });

  it('Should redact JSON with a nested object', async function () {
    let properties = [ 'apiKey', 'password', 'phone' ];
    let redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    let json = {
      'obj': {
        'apiKey': 'a1b2c3',
        'password': 'P@$$w0rd',
        'phone': 1234567890
      }
    };

    let redacted = redactyl.redact(json);

    expect(redactyl.redact.calledTwice).to.equal(true);
    expect(typeof redacted).to.equal('object');
    for (let prop in redacted.obj) {
      expect(redacted.obj[prop]).to.equal(DEFAULT_TEXT);
    }
  });

  it('Should redact array with objects', async function () {
    const properties = [ 'apiKey', 'password', 'phone' ];
    const redactyl = new Redactyl({ 'properties': properties });
    sinon.spy(redactyl, 'redact');

    const json = [
      {
        'apiKey': 'a1b2c3',
        'password': 'P@$$w0rd',
        'phone': 1234567890
      },
      {
        'apiKey': 'a1b2c3',
        'password': 'P@$$w0rd',
        'phone': 1234567890
      }
    ];

    const redacted = redactyl.redact(json);

    expect(redactyl.redact.callCount).to.equal(3);
    expect(Array.isArray(redacted)).to.equal(true);
    expect(redacted.length).to.equal(2);
    redacted.forEach((item) => {
      for (const prop in item) {
        expect(item[prop]).to.equal(DEFAULT_TEXT);
      }
    });
  });

  it('Should fail to set a custom replacer function, function not passed as options', async function () {
    const options = { 'replacer': ['not', 'a', 'function'] };

    try {
      new Redactyl(options);
    } catch (err) {
      expect(err.name === TypeError.name);
      expect(err.message === REPLACER_ERROR);
    }
  });

  it('Should fail to set a custom replacer function, function using the setReplacer function', async function () {
    const redactyl = new Redactyl();

    try {
      sinon.spy(redactyl, 'setReplacer');
      redactyl.setReplacer(['not', 'a', 'function']);
    } catch (err) {
      expect(redactyl.setReplacer.callCount).to.equal(1);
      expect(err.name === TypeError.name);
      expect(err.message === REPLACER_ERROR);
    }
  });

  it('Should set use a custom replacer function passed as options', async function () {
    const fn = function () {};
    const options = { 'replacer': fn };

    const redactyl = new Redactyl(options);

    expect(redactyl.replacer === fn);
  });

  it('Should set use a custom replacer function options', async function () {
    const fn = function () {};

    const redactyl = new Redactyl();

    sinon.spy(redactyl, 'setReplacer');
    redactyl.setReplacer(fn);

    expect(redactyl.setReplacer.callCount).to.equal(1);
    expect(redactyl.replacer).to.equal(fn);
  });

  it('Should replace circular references with the token "[CIRCULAR]"', async function () {
    const redactyl = new Redactyl();

    sinon.spy(redactyl, 'setReplacer');
    redactyl.setReplacer(getReplacer());

    expect(redactyl.setReplacer.callCount).to.equal(1);

    const json = {
      'apiKey': 'a1b2c3',
      'password': 'P@$$w0rd',
      'phone': 1234567890
    };
    json.circular = json;

    const redacted = redactyl.redact(json);
    expect(redacted.circular).to.equal(CIRCULAR_TEXT);
  });
});
