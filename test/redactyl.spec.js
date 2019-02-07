'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Redactyl = require('..');

const DEFAULT_TEXT = '[REDACTED]';
const CUSTOM_TEXT = '[SECURED]';

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

    try {
      let redacted = redactyl.redact([]);
    } catch (err) {
      expect(err).to.exist;
      expect(err.constructor.name).to.equal('TypeError');
    }
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
});
