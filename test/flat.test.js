'use strict';
const Logr = require('logr');
const logrFlat = require('../index.js');
const test = require('tap').test;
const http = require('http');

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

test('just some examples', (t) => {
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat
      }
    }
  });
  log(['error'], 'this is an error');
  log(['warning'], 'this is an error');
  log(['notice'], 'this is an error');
  t.end();
});

test('app examples', (t) => {
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat,
        options: {
          appColor: true
        }
      }
    }
  });
  log(['app1', 'error'], { msg: 'blah', stack: { a: 1, b: 2 } });
  log(['app2', 'warning'], 'this is an error');
  log(['app1', 'notice'], 'this is an error');
  t.end();
});

test('complex object', (t) => {
  const log = Logr.createLogger({
    type: 'flat',
    reporters: {
      flat: {
        reporter: logrFlat
      }
    }
  });
  log(['complex'], { incoming: new http.IncomingMessage() });
  t.end();
});
