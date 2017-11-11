'use strict';
const flatten = require('flat');
const chalk = require('chalk');

exports.defaults = {
  blacklist: 'password|token',
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
  const blacklistRegEx = new RegExp(options.blacklist, 'i');

  if (typeof message === 'object') {
    const flatObj = flatten(message);
    message = '';
    Object.keys(flatObj).forEach((key) => {
      let value = flatObj[key];
      if (key.match && key.match(blacklistRegEx) !== null) {
        value = 'xxxxxx';
      }
      const keyColor = colors.gray(`${key}:`);
      message += `${keyColor}${value} `;
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
