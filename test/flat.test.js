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
    info: {
      githubPassword: 'should be crossed out'
    },
    token: 'should be crossed out',
    this: 'is fine'
  });
  console.log = oldConsole;
  t.equal(logs[0].indexOf('should be crossed out'), -1, 'redacts any key that matches or includes the blacklisted terms');
  t.notEqual(logs[0].indexOf('is fine'), -1, 'does include stuff not blacklisted');
  t.end();
});

test('will print "message" property first', (t) => {
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
    message: 'this should be first',
    hello: 'goodbye',
    number: 9
  });
  console.log = oldConsole;
  t.notOk(logs[0].includes('message:'));
  t.ok(logs[0].includes('this should be first'));
  t.end();
});
