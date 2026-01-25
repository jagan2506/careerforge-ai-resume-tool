import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/resume", async (req, res) => {
  let browser;
  let page;

  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "Missing url" });
    }

    console.log("PDF route hit with url:", url);

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    console.log("PDF buffer length:", pdfBuffer.length);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).send("PDF generation failed: empty buffer");
    }

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": 'attachment; filename="careerforge-resume.pdf"',
      "Content-Transfer-Encoding": "binary"
    });
    res.end(pdfBuffer);
  } catch (e) {
    console.error("PDF generation failed:", e);
    res.status(500).send("PDF generation failed: " + e.message);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
});

export default router;
