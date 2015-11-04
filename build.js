#!/usr/bin/env node

var resume = require('./resume');
var theme = require('jsonresume-theme-briefstrap');
var pdf = require('html-pdf');
var Promise = require('bluebird');
var isogram = require('isogram');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');

build.DEFAULT_OPTS = {
  pdf: {
    filename: './resume.pdf',
    border: {top: '.75in', right: '.5in', bottom: '.75in', left: '.5in'}
  },
  prerender: function (result) {
    result.js += isogram({id: 'UA-63592021-1'});
    return result;
  }
};

function build (opts) {
  opts = _.merge({}, build.DEFAULT_OPTS, opts);
  return theme.render(resume, opts).then(function (html) {
    return Promise.props({
      html: fs.writeFileAsync('index.html', html),
      pdf: Promise.promisifyAll(pdf.create(html, opts.pdf)).toFileAsync()
    });
  });
};

module.exports = build;

if (require.main === module) build().done();
