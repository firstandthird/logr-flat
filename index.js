'use strict';
const flatten = require('flat');
const stringify = require('json-stringify-safe');
const chalk = require('chalk');

exports.defaults = {
  timestamp: 'HH:mm:ss',
  colors: {
    error: 'bgRed',
    warning: 'bgYellow',
    success: 'bgGreen',
    notice: 'bgBlue'
  },
  appColor: false
};

const appColors = {};
const availableColors = [
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'red'
];
let lastColorIndex = 0;

exports.log = function(options, tags, message) {
  const colors = new chalk.constructor({ enabled: (options.colors !== false) });
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
    let color = options.colors[tag];
    if (i === 0 && options.appColor) {
      if (!appColors[tag]) {
        appColors[tag] = availableColors[lastColorIndex];
        lastColorIndex++;
        if (lastColorIndex > availableColors.length - 1) {
          lastColorIndex = 0;
        }
      }
      color = appColors[tag];
    }
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
