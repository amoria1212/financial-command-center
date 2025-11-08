#!/usr/bin/env node

/**
 * QuickBooks Processor
 *
 * Processes QuickBooks P&L PDFs or screenshots
 * Usage: node src/process_quickbooks.js <pdf-or-screenshot-path>
 */

const ScreenshotReader = require('./ocr/screenshot_reader');
const QuickBooksParser = require('./processors/quickbooks_parser');
const fs = require('fs').promises;
const path = require('path');

// PDF support
let PDFExtract;
try {
  PDFExtract = require('pdf.js-extract').PDFExtract;
} catch (e) {
  // PDF library not available
}

async function processQuickBooks(filePath) {
  console.log('\n' + '='.repeat(70));
  console.log('QUICKBOOKS P&L PROCESSOR');
  console.log('='.repeat(70) + '\n');

  let ocrData;

  // Determine if PDF or image
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf' && PDFExtract) {
    ocrData = await extractFromPDF(filePath);
  } else {
    // Use OCR for images or if PDF library not available
    const reader = new ScreenshotReader();
    ocrData = await reader.read(filePath);
  }

  // Parse QuickBooks data
  const parser = new QuickBooksParser();
  const qbData = parser.parse(ocrData);

  // Display results
  displayResults(qbData);

  // Save to JSON
  const outputPath = await saveResults(filePath, qbData);

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Complete! Data saved to: ${path.basename(outputPath)}`);
  console.log('='.repeat(70) + '\n');

  return qbData;
}

async function extractFromPDF(pdfPath) {
  console.log('📄 Extracting text from PDF...');

  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extract(pdfPath, {});

  // Combine all text from all pages
  let fullText = '';
  const lines = [];

  for (const page of data.pages) {
    for (const item of page.content) {
      fullText += item.str + ' ';
      lines.push(item.str);
    }
  }

  // Use ScreenshotReader's parse function for consistency
  const reader = new ScreenshotReader();
  const parsed = reader.parseFinancialData(fullText);

  return {
    ...parsed,
    extractedDate: new Date().toISOString(),
    source: pdfPath
  };
}

function displayResults(data) {
  console.log('\n' + '='.repeat(70));
  console.log(`PERIOD: ${data.period.text}`);
  console.log('='.repeat(70) + '\n');

  console.log('CURRENT PERIOD METRICS:');
  console.log(`Total Revenue:                 $${data.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  console.log(`Total Expenses:                $${data.totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  console.log(`Net Income:                    $${data.netIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  console.log(`Profit Margin:                 ${data.profitMargin.toFixed(1)}%`);

  if (data.projectedAnnualRevenue) {
    console.log('\nANNUAL PROJECTIONS:');
    console.log(`Projected Annual Revenue:      $${data.projectedAnnualRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
    console.log(`Projected Annual Expenses:     $${data.projectedAnnualExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
    console.log(`Projected Annual Net Income:   $${data.projectedAnnualNetIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  }

  if (data.expenses.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('EXPENSE BREAKDOWN (Highest to Lowest)');
    console.log('-'.repeat(70));

    const sorted = [...data.expenses].sort((a, b) => b.amount - a.amount);
    const top8 = sorted.slice(0, 8);

    for (const expense of top8) {
      const category = `  ${expense.category}`.padEnd(50);
      const amount = `$${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      console.log(category + amount);
    }

    if (sorted.length > 8) {
      console.log(`  ... and ${sorted.length - 8} more categories`);
    }
  }

  console.log('\n' + '-'.repeat(70));
  console.log('PRACTICE SUSTAINABILITY');
  console.log('-'.repeat(70));
  console.log(`Status:                        ${data.sustainability.toUpperCase()}`);
  console.log(`Profit Margin:                 ${data.profitMargin.toFixed(1)}%`);
  if (data.emergencyReserve) {
    console.log(`Recommended Emergency Reserve: $${data.emergencyReserve.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  }
}

async function saveResults(filePath, data) {
  const extractedDir = path.join(process.cwd(), 'data', 'extracted');

  await fs.mkdir(extractedDir, { recursive: true });

  const basename = path.basename(filePath, path.extname(filePath));
  const outputPath = path.join(extractedDir, `${basename}_quickbooks.json`);

  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));

  return outputPath;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('\n❌ Error: Please provide a file path');
    console.log('\nUsage: node src/process_quickbooks.js <pdf-or-screenshot-path>');
    console.log('Example: node src/process_quickbooks.js data/October.pdf\n');
    process.exit(1);
  }

  processQuickBooks(args[0])
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = processQuickBooks;
