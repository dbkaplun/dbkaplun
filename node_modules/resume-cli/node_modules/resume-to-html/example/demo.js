var resumeToHTML = require(__dirname + '/..');
var fs = require('fs');
var path = require('path');

var resumeObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'resume.json'), 'utf8'));

resumeToHTML(resumeObject, {theme: 'modern'}, function (html, errs) {
	fs.writeFileSync(__dirname + '/resume.html', html);
});