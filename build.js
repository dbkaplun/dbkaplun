#!/usr/bin/env node

var resume = require('./resume');
var theme = require('jsonresume-theme-briefstrap');
var pdf = require('html-pdf');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

build.opts = {
  pdf: {filename: './resume.pdf'}
};
function build () {
  return theme.render(resume, {less: {rootpath: 'node_modules/jsonresume-theme-briefstrap'}}).then(function (html) {
    return Promise.all([
      fs.writeFileAsync('index.html', html),
      Promise.promisifyAll(pdf.create(html, build.opts))
        .toBufferAsync()
        .then(fs.writeFileAsync.bind(null, 'resume.pdf'))
    ]);
  });
};

module.exports = build;

if (require.main === module) build().done();
