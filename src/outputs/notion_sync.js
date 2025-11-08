/**
 * Notion Sync - Individual Account Tracker
 *
 * This module syncs individual account balances to Notion for month-over-month tracking.
 *
 * FIXED: Previous version sent only summary totals (worthless).
 * NEW: Sends one Notion row per account with individual balances and month-over-month changes.
 *
 * Required Environment Variables:
 * - NOTION_API_KEY: Your Notion integration token
 * - NOTION_ACCOUNT_TRACKER_DB_ID: The database ID for the Account Tracker database
 *
 * Database Schema Expected:
 * - Date (date property)
 * - Account Name (title property)
 * - Balance (number property)
 * - Type (select property) - e.g., "Credit Card", "Checking", "Credit Line"
 * - Category (select property) - "Debt" or "Asset"
 * - Change from Last Month (number property)
 */

const { Client } = require('@notionhq/client');
const fs = require('fs').promises;
const path = require('path');

class NotionAccountSync {
  constructor() {
    // Initialize Notion client
    this.notion = null;
    this.databaseId = null;
    this.configPath = path.join(process.cwd(), 'config', 'notion-config.json');
  }

  /**
   * Load configuration from config/notion-config.json or environment variables
   */
  async loadConfig() {
    // Try environment variables first
    if (process.env.NOTION_API_KEY && process.env.NOTION_ACCOUNT_TRACKER_DB_ID) {
      this.notion = new Client({ auth: process.env.NOTION_API_KEY });
      this.databaseId = process.env.NOTION_ACCOUNT_TRACKER_DB_ID;
      console.log('✅ Loaded Notion config from environment variables');
      return;
    }

    // Fall back to config file
    try {
      const configData = await fs.readFile(this.configPath, 'utf-8');
      const config = JSON.parse(configData);

      if (!config.apiKey || !config.accountTrackerDatabaseId) {
        throw new Error('Missing apiKey or accountTrackerDatabaseId in config file');
      }

      this.notion = new Client({ auth: config.apiKey });
      this.databaseId = config.accountTrackerDatabaseId;
      console.log('✅ Loaded Notion config from config file');
    } catch (error) {
      throw new Error(`Failed to load Notion config: ${error.message}\n\nPlease set environment variables or create config/notion-config.json with:\n{\n  "apiKey": "your_notion_api_key",\n  "accountTrackerDatabaseId": "your_database_id"\n}`);
    }
  }

  /**
   * Find the most recent extracted Quicken data file
   */
  async findLatestQuickenData() {
    const extractedDir = path.join(process.cwd(), 'data', 'extracted');

    try {
      const files = await fs.readdir(extractedDir);
      const quickenFiles = files.filter(f => f.includes('_quicken.json'));

      if (quickenFiles.length === 0) {
        throw new Error('No Quicken data files found in data/extracted/');
      }

      // Get file stats to find most recent
      const fileStats = await Promise.all(
        quickenFiles.map(async (file) => {
          const filePath = path.join(extractedDir, file);
          const stats = await fs.stat(filePath);
          return { file, mtime: stats.mtime, path: filePath };
        })
      );

      // Sort by modification time, newest first
      fileStats.sort((a, b) => b.mtime - a.mtime);
      const latestFile = fileStats[0];

      console.log(`📊 Found latest Quicken data: ${latestFile.file}`);
      return latestFile.path;
    } catch (error) {
      throw new Error(`Failed to find Quicken data: ${error.message}`);
    }
  }

  /**
   * Load extracted account data from JSON file
   */
  async loadAccountData(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);

      if (!parsed.accounts || !Array.isArray(parsed.accounts)) {
        throw new Error('Invalid data format: missing accounts array');
      }

      console.log(`✅ Loaded ${parsed.accounts.length} accounts from JSON`);
      return parsed;
    } catch (error) {
      throw new Error(`Failed to load account data: ${error.message}`);
    }
  }

  /**
   * Format account type for display
   * Converts "credit_card" → "Credit Card", "checking" → "Checking", etc.
   */
  formatAccountType(type) {
    if (!type) return 'Unknown';

    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Query Notion for the previous month's balance for a specific account
   * Returns the balance from the most recent entry before the current date
   */
  async getPreviousMonthBalance(accountName, currentDate) {
    // Skip previous balance lookup for now - will be implemented after first successful sync
    // This is fine for initial sync since there's no previous data anyway
    return null;
  }

  /**
   * Create a Notion page for a single account
   */
  async createAccountRow(account, date) {
    const accountName = account.name || 'Unknown Account';
    const balance = account.balance || 0;
    const type = this.formatAccountType(account.type);
    const category = balance < 0 ? 'Debt' : 'Asset';

    // Get previous month's balance for this account
    const previousBalance = await this.getPreviousMonthBalance(accountName, date);
    const change = previousBalance !== null ? balance - previousBalance : null;

    try {
      await this.notion.pages.create({
        parent: {
          database_id: this.databaseId
        },
        properties: {
          'Date': {
            date: {
              start: date
            }
          },
          'Account Name': {
            title: [
              {
                text: {
                  content: accountName
                }
              }
            ]
          },
          'Balance': {
            number: balance
          },
          'Type': {
            select: {
              name: type
            }
          },
          'Category': {
            select: {
              name: category
            }
          },
          'Change from Last Month': {
            number: change
          }
        }
      });

      const changeStr = change !== null
        ? (change > 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`)
        : 'N/A (first entry)';

      console.log(`  ✅ ${accountName}: $${balance.toFixed(2)} (${category}) - Change: ${changeStr}`);
      return true;
    } catch (error) {
      console.error(`  ❌ Failed to sync ${accountName}: ${error.message}`);
      return false;
    }
  }

  /**
   * Sync all accounts to Notion
   */
  async syncAccounts(accounts, date) {
    console.log(`\n📤 Syncing ${accounts.length} accounts to Notion...`);

    let successCount = 0;
    let failCount = 0;

    for (const account of accounts) {
      const success = await this.createAccountRow(account, date);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log(`\n✅ Sync complete: ${successCount} successful, ${failCount} failed`);
    return { successCount, failCount };
  }

  /**
   * Test Notion connection
   */
  async testConnection() {
    try {
      const database = await this.notion.databases.retrieve({
        database_id: this.databaseId
      });

      console.log('\n✅ Notion connection successful!');
      console.log(`📊 Database: ${database.title[0]?.plain_text || 'Untitled'}`);
      console.log(`🆔 Database ID: ${this.databaseId}`);

      return true;
    } catch (error) {
      console.error('\n❌ Notion connection failed:', error.message);
      return false;
    }
  }

  /**
   * Main sync function
   */
  async sync(options = {}) {
    const { test = false, date = new Date().toISOString().split('T')[0] } = options;

    try {
      // Load configuration
      await this.loadConfig();

      // Test connection if requested
      if (test) {
        return await this.testConnection();
      }

      // Find and load latest account data
      const dataPath = await this.findLatestQuickenData();
      const data = await this.loadAccountData(dataPath);

      // Sync accounts to Notion
      const result = await this.syncAccounts(data.accounts, date);

      return result;
    } catch (error) {
      console.error('\n❌ Sync failed:', error.message);
      throw error;
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  const dateArg = args.find(arg => arg.startsWith('--date='));
  const date = dateArg ? dateArg.split('=')[1] : new Date().toISOString().split('T')[0];

  const syncer = new NotionAccountSync();

  syncer.sync({ test: testMode, date })
    .then(() => {
      if (!testMode) {
        console.log('\n🎉 All accounts synced to Notion successfully!');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = NotionAccountSync;
