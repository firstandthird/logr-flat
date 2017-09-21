'use strict';
const flatten = require('flat');
const stringify = require('json-stringify-safe');
const chalk = require('chalk');

exports.defaults = {
  timestamp: 'HH:mm:ss',
  theme: {
    timestamp: 'gray',
    brackets: 'gray',
    keys: 'gray',
    message: 'white',
    values: 'white',
    tags: 'gray'
  },
  tagColors: {
    error: 'bgRed',
    warning: 'bgYellow',
    success: 'bgGreen',
    notice: 'bgBlue'
  },
  appColor: false,
  flatDepth: 2
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
  const ts = (options.timestamp) ? colors[options.theme.timestamp](`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `) : '';

  if (typeof message === 'object') {
    const flatObj = flatten(message, {
      maxDepth: options.flatDepth
    });
    message = '';
    Object.keys(flatObj).forEach((key) => {
      const keyColor = colors[options.theme.keys](`${key}:`);
      message += `${keyColor}${colors[options.theme.values](stringify(flatObj[key]))} `;
    });
  } else {
    message = colors[options.theme.message](message);
  }

  tags.forEach((tag, i) => {
    let color = options.tagColors[tag];
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
    tags[i] = (color) ? colors[color](tag) : colors[options.theme.tags](tag);
  });

  const renderTags = (localTags) => {
    if (localTags.length === 0) {
      return '';
    }
    return `${colors[options.theme.brackets]('[')}${localTags.join(colors[options.theme.brackets](','))}${colors[options.theme.brackets](']')} `;
  };
  const out = `${ts}${renderTags(tags)}${message}`;
  return out;
};
