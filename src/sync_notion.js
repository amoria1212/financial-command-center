#!/usr/bin/env node

/**
 * Notion Sync Entry Point
 *
 * This is the main entry point called by `npm run notion`
 * It loads the NotionAccountSync class and executes the sync
 *
 * Usage:
 *   npm run notion              # Sync latest Quicken data to Notion
 *   npm run notion -- --test    # Test Notion connection
 *   npm run notion -- --date=2025-11-08  # Sync with specific date
 */

const NotionAccountSync = require('./outputs/notion_sync');

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  const dateArg = args.find(arg => arg.startsWith('--date='));
  const date = dateArg ? dateArg.split('=')[1] : new Date().toISOString().split('T')[0];

  console.log('\n🔄 Financial Command Center - Notion Sync');
  console.log('==========================================\n');

  if (testMode) {
    console.log('🧪 Testing Notion connection...\n');
  } else {
    console.log(`📅 Sync Date: ${date}\n`);
  }

  const syncer = new NotionAccountSync();

  try {
    await syncer.sync({ test: testMode, date });

    if (testMode) {
      console.log('\n✅ Connection test passed!');
    } else {
      console.log('\n🎉 Sync completed successfully!');
      console.log('\n📊 Check your Notion Account Tracker database to see the individual account rows.');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
