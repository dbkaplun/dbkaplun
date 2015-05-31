#!/usr/bin/env node

var resume = require('./resume');
var theme = require('jsonresume-theme-briefstrap');
var pdf = require('html-pdf');
var Promise = require('bluebird');
var isogram = require('isogram');
var fs = Promise.promisifyAll(require('fs'));

build.opts = {
  js: {append: isogram({id: 'UA-63592021-1'})},
  pdf: {
    filename: './resume.pdf',
    border: {top: '.75in', right: '.5in', bottom: '.75in', left: '.5in'}
  }

};
function build (opts) {
  opts = opts || build.opts;
  return theme.render(resume, opts).then(function (html) {
    return Promise.all([
      fs.writeFileAsync('index.html', html),
      Promise.promisifyAll(pdf.create(html, opts.pdf)).toFileAsync()
    ]);
  });
};

module.exports = build;

if (require.main === module) build().done();
