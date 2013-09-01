#!/usr/bin/env node
// require('babel-register'); // FIXME

const path = require('path');
const puppeteer = require('puppeteer');


module.exports.resolve = resolve;
function resolve (relpath) {
  return path.resolve(__dirname, relpath);
}

module.exports.buildPDF = buildPDF;
async function buildPDF () {
  const pdfPath = resolve('out/resume.pdf');
  console.log(`> Building PDF to ${pdfPath}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${resolve('out/resume/index.html')}`, {waitUntil: 'networkidle'});
  await page.pdf({path: pdfPath, pageRanges: '1'});
  await browser.close();

  console.log("  build completed");
}

if (require.main === module) {
  buildPDF();
}
