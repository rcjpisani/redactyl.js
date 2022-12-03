const Redactyl = require('..');
const Benchmark = require('benchmark');

function getNestedObject(nestedCount = 3) {
    const obj = {};

    if (nestedCount > 0) {
        obj['sensitive'] = 'test';
        obj[`${nestedCount}`] = getNestedObject(nestedCount - 1);
    }

    return obj;
}

const redactyl = new Redactyl({ properties: ['sensitive'] });
const json = getNestedObject();

const suite = new Benchmark.Suite();

suite.add('redact', function() {
    redactyl.redact(json)
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.run();