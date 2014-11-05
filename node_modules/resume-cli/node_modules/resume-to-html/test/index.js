var test = require('tape');
var resumeToHTML = require('../lib/converter');

var resumeJson = {};

test('Test resumeToText on resume.json.', function(t) {
    resumeToHTML(resumeJson, {}, function(report, err) {
        t.plan(1);
        t.equal(err, null, 'no errors');
    });
});