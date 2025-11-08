#!/usr/bin/env node

/**
 * Quicken Simplifi Processor
 *
 * Processes Quicken screenshots and extracts account balances
 * Usage: node src/process_quicken.js <screenshot-path>
 */

const ScreenshotReader = require('./ocr/screenshot_reader');
const QuickenParser = require('./processors/quicken_parser_v2');
const fs = require('fs').promises;
const path = require('path');

async function processQuicken(imagePath) {
  console.log('\n' + '='.repeat(70));
  console.log('QUICKEN SIMPLIFI PROCESSOR');
  console.log('='.repeat(70) + '\n');

  // Step 1: OCR extraction
  const reader = new ScreenshotReader();
  const ocrData = await reader.read(imagePath);

  // Step 2: Parse Quicken data
  const parser = new QuickenParser();
  const quickenData = parser.parse(ocrData);

  // Step 3: Display results
  displayResults(quickenData);

  // Step 4: Save to JSON
  const outputPath = await saveResults(imagePath, quickenData);

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Complete! Data saved to: ${path.basename(outputPath)}`);
  console.log('='.repeat(70) + '\n');

  return quickenData;
}

function displayResults(data) {
  console.log('\n' + '='.repeat(70));
  console.log('FINANCIAL OVERVIEW');
  console.log('='.repeat(70) + '\n');

  // Net worth
  if (data.netWorth !== null) {
    console.log(`Net Worth:                     $${data.netWorth.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  }

  console.log(`Total Assets:                  $${data.totalAssets.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  console.log(`Total Debt:                    $${data.totalDebt.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
  console.log(`Liquid Assets:                 $${data.liquidAssets.toLocaleString('en-US', {minimumFractionDigits: 2})}`);

  // Asset accounts
  const assets = data.accounts.filter(a => a.balance >= 0);
  if (assets.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('ASSET ACCOUNTS'.padEnd(50) + 'BALANCE');
    console.log('-'.repeat(70));

    for (const account of assets) {
      const name = `  ${account.name}`.padEnd(50);
      const balance = `$${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      console.log(name + balance);
    }
  }

  // Debt accounts
  const debts = data.accounts.filter(a => a.balance < 0);
  if (debts.length > 0) {
    // Sort by balance (most negative first)
    debts.sort((a, b) => a.balance - b.balance);

    console.log('\n' + '-'.repeat(70));
    console.log('DEBT ACCOUNTS (Highest to Lowest)'.padEnd(50) + 'BALANCE');
    console.log('-'.repeat(70));

    for (const account of debts) {
      const name = `  ${account.name}`.padEnd(50);
      const balance = `$${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      console.log(name + balance);
    }
  }

  // Validation
  if (data.netWorth !== null) {
    const calculated = data.totalAssets + data.totalDebt;
    const difference = data.netWorth - calculated;

    console.log('\n' + '-'.repeat(70));
    console.log('NET WORTH VALIDATION');
    console.log('-'.repeat(70));
    console.log(`Extracted Net Worth:           $${data.netWorth.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
    console.log(`Calculated from Accounts:      $${calculated.toLocaleString('en-US', {minimumFractionDigits: 2})}`);
    console.log(`Difference:                    $${difference.toLocaleString('en-US', {minimumFractionDigits: 2})}`);

    if (Math.abs(difference) > 1000) {
      console.log('\n⚠️  Large discrepancy detected - likely indicates investment/retirement');
      console.log('    accounts not visible in this screenshot view.');
    }
  }
}

async function saveResults(imagePath, data) {
  const extractedDir = path.join(process.cwd(), 'data', 'extracted');

  // Ensure directory exists
  await fs.mkdir(extractedDir, { recursive: true });

  // Generate output filename
  const basename = path.basename(imagePath, path.extname(imagePath));
  const outputPath = path.join(extractedDir, `${basename}_quicken.json`);

  // Save JSON
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));

  return outputPath;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('\n❌ Error: Please provide a screenshot path');
    console.log('\nUsage: node src/process_quicken.js <screenshot-path>');
    console.log('Example: node src/process_quicken.js data/screenshots/quicken-nov.png\n');
    process.exit(1);
  }

  const imagePath = args[0];

  processQuicken(imagePath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = processQuicken;
