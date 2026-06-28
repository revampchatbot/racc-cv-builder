const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const { buildCvHtml } = require('../views/cv-template');

// Tell Vercel to auto-parse JSON body and allow up to 5MB (for base64 photo)
module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data || !data.name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let browser;
  try {
    const html = buildCvHtml(data);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const safeName = (data.name || 'CV').replace(/[^a-zA-Z0-9\-_ ]/g, '').replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_RACC_CV.pdf"`);
    res.send(pdf);
  } catch (err) {
    console.error('[CV PDF] Error:', err);
    res.status(500).json({ error: 'PDF generation failed', detail: err.message });
  } finally {
    if (browser) await browser.close();
  }
};
