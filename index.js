'use strict';
const flatten = require('flat');
const chalk = require('chalk');

exports.defaults = {
  blacklist: 'password|token',
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
  flatDepth: 3
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
  const blacklistRegEx = new RegExp(options.blacklist, 'i'); // blacklist is case insensitive

  if (typeof message === 'object') {
    const flatObj = flatten(message, {
      maxDepth: options.flatDepth
    });
    message = '';
    // print the 'message' property first if it exists:
    if (flatObj.message) {
      message = `${colors[options.theme.values](flatObj.message)} | `;
      delete flatObj.message;
    }
    Object.keys(flatObj).forEach((key) => {
      const keyColor = colors[options.theme.keys](`${key}:`);
      let value = flatObj[key];
      if (key.match && key.match(blacklistRegEx) !== null) {
        value = 'xxxxxx';
      }
      try {
        message += `${keyColor}${colors[options.theme.values](value)} `;
      } catch (e) {
        message += `${keyColor}${colors[options.theme.values]('ERROR LOGGING')} `;
      }
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
