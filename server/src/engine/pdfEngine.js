const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF reading
 * @param {object} readingData - Full result from synthesisEngine
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(readingData) {
  const templatePath = path.join(__dirname, 'templates', 'reading.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(templateHtml);

  const context = {
    name: readingData.input.name,
    date: new Date().toLocaleDateString(),
    coreEssence: readingData.narrative.coreEssence,
    identifiers: readingData.narrative.identifiers,
    dynamics: readingData.narrative.dynamics
  };

  const html = template(context);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = {
  generatePDF
};
