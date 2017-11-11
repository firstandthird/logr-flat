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

test('can use the blacklist option to filter out sensitive info', (t) => {
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
      }
    }
  });
  log({
    password: 'should be crossed out',
    emailPassword: 'should be crossed out',
    token: 'should be crossed out',
    this: 'is fine'
  });
  console.log = oldConsole;
  t.equal(logs[0].indexOf('should be crossed out'), -1, 'redacts any key that matches or includes the blacklisted terms');
  t.notEqual(logs[0].indexOf('is fine'), -1, 'does include stuff not blacklisted');
  t.end();
});
