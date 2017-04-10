'use strict';
const flatten = require('flat');
const stringify = require('json-stringify-safe');
const chalk = require('chalk');

exports.defaults = {
  timestamp: 'HH:mm:ss',
  colors: {
    error: 'red',
    warning: 'yellow',
    success: 'green',
    notice: 'blue'
  }
};

exports.log = function(options, tags, message) {
  const colors = new chalk.constructor({ enabled: (options.colors) });
  const now = new Date();
  const ts = (options.timestamp) ? colors.gray(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `) : '';

  if (typeof message === 'object') {
    const flatObj = flatten(message);
    message = '';
    Object.keys(flatObj).forEach((key) => {
      const keyColor = colors.gray(`${key}:`);
      message += `${keyColor}${stringify(flatObj[key])} `;
    });
  }

  tags.forEach((tag, i) => {
    const color = options.colors[tag];
    tags[i] = (color) ? colors[color](tag) : colors.gray(tag);
  });

  const renderTags = (localTags) => {
    if (localTags.length === 0) {
      return '';
    }
    return `${colors.gray('[')}${localTags.join(colors.gray(','))}${colors.gray(']')} `;
  };
  const out = `${ts}${renderTags(tags)}${message}`;
  return out;
};
