'use strict';
const Logr = require('logr');
const logrFlat = require('../index.js');
const test = require('tap').test;

test('can load the flat  plugin ', (t) => {
  t.plan(1);
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat
      }
    }
  });
  t.equal(typeof log, 'function', 'should register a "log" function');
});

test('can use the flat plugin to print an object as one log line', (t) => {
  const oldConsole = console.log;
  const logs = [];
  console.log = (data) => {
    logs.push(data);
  };
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat
      }
    }
  });
  log({
    a: true,
    b: false,
    hi: 'there',
    hello: 'goodbye',
    number: 9
  });
  console.log = oldConsole;
  t.equal(logs.length, 1, 'prints all on one line');
  t.end();
});

test('can use the flat plugin to print an object with colorful keys', (t) => {
  const oldConsole = console.log;
  const logs = [];
  console.log = (data) => {
    logs.push(data);
  };
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat,
        colors: true
      }
    }
  });
  log({
    a: true,
    b: false,
    hi: 'there',
    hello: 'goodbye',
    number: 9
  });
  console.log = oldConsole;
  t.equal(logs.length, 1, 'prints all on one line');
  t.end();
});
