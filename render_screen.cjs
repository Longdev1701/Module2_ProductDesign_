const puppeteer = require('puppeteer-core');
const path = require('path');

async function renderHtmlToPng(htmlPath, outputPath) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1100, deviceScaleFactor: 1 });
  
  const fileUrl = htmlPath.startsWith('http') ? htmlPath : ('file:///' + path.resolve(htmlPath).replace(/\\/g, '/'));
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  // Wait extra 1 second for webfonts / tailwind cdn to finish layout
  await new Promise(r => setTimeout(r, 1500));
  
  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log('Saved screenshot to:', outputPath);
}

const htmlFile = process.argv[2] || './stitch_lexiguard_compliance_navigator/dashboard_themis_unified/code.html';
const outFile = process.argv[3] || './stitch_lexiguard_compliance_navigator/test_dashboard.png';

renderHtmlToPng(htmlFile, outFile).catch(console.error);
