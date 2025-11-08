# Notion Integration Setup Guide

**Purpose**: Connect your Financial Command Center to Notion for automated metric tracking and mobile access.

**Time Required**: 10-15 minutes

**Result**: Financial data automatically syncs to Notion database where Zephyr can build custom views for tracking progress toward September 2026 capital realignment.

---

## Overview

**What Gets Synced**:
- Net worth, assets, debt (from Quicken)
- Practice revenue, expenses, profit (from QuickBooks)
- Cash flow (from bank statements)
- Calculated metrics (debt payoff timeline, sustainability status)

**What Stays Local**:
- Detailed transactions
- Raw OCR text
- Account numbers
- Full financial breakdown

**Sync Frequency**: Manual (run `npm run notion` when you want to sync)

---

## Step 1: Create Notion Integration

**1.1** Go to: https://www.notion.so/my-integrations

**1.2** Click **"+ New integration"**

**1.3** Fill in the details:
- **Name**: Financial Command Center
- **Logo**: (optional - can skip)
- **Associated workspace**: Select your Notion workspace
- **Type**: Internal Integration

**1.4** Click **"Submit"**

**1.5** On the next page, you'll see your **Integration Token** (starts with `secret_`)

**1.6** **Copy this token** - you'll need it in Step 3

**IMPORTANT**: Treat this token like a password. Don't share it or commit it to git.

---

## Step 2: Create Notion Database (or Ask Zephyr)

**Option A: Have Zephyr Build It** (Recommended)

Hand off to Zephyr with:
- This setup guide
- `NOTION-VIEWS-FOR-ZEPHYR.md` (database schema and views)
- Zephyr will build the database with all properties and views

**Option B: Build It Yourself**

**2.1** In Notion, go to the page where you want the database

**2.2** Type `/database` and select **"Table - Full page"**

**2.3** Name it: **Financial Metrics Tracker**

**2.4** Add these properties (click + in column header):

| Property Name | Type | Config |
|---------------|------|--------|
| Date | Date | - |
| Status | Select | Options: Active, Archived |
| Net Worth | Number | Format: Dollar |
| Total Assets | Number | Format: Dollar |
| Total Debt | Number | Format: Dollar |
| Liquid Assets | Number | Format: Dollar |
| Asset Accounts | Number | Format: Number |
| Debt Accounts | Number | Format: Number |
| Practice Revenue | Number | Format: Dollar |
| Practice Expenses | Number | Format: Dollar |
| Practice Net Income | Number | Format: Dollar |
| Profit Margin | Number | Format: Percent |
| Practice Status | Select | Options: Excellent, Good, Moderate, Marginal, Concerning |
| Period | Text | - |
| Net Cash Flow | Number | Format: Dollar |
| Data Sources | Multi-select | Options: Quicken, QuickBooks, Bank Statements |

**2.5** Create the database and move to Step 3

---

## Step 3: Share Database with Integration

**3.1** Open your Notion database (Financial Metrics Tracker)

**3.2** Click the **⋯** menu (top right)

**3.3** Scroll down and click **"+ Add connections"**

**3.4** Search for **"Financial Command Center"** (your integration name)

**3.5** Click the integration to add it

**3.6** You'll see it appear under "Connections"

**Why This Step**: Integrations can only access pages/databases you explicitly share with them. This keeps your other Notion content private.

---

## Step 4: Get Database ID

**4.1** Open your Notion database in your browser

**4.2** Look at the URL. It will look like:
```
https://www.notion.so/workspace-name/abc123def456?v=xyz789
```

**4.3** The database ID is the part after the last `/` and before the `?`:
```
abc123def456
```

**4.4** Copy this ID - you'll need it in the next step

**Note**: If your URL has a title like this:
```
https://www.notion.so/workspace/Financial-Metrics-Tracker-abc123def456?v=xyz789
```
The ID is still the 32-character string: `abc123def456`

---

## Step 5: Configure Financial Command Center

**5.1** Navigate to your project folder:
```bash
cd C:\Users\janic\OneDrive\Documents\Claude Vault\financial-command-center
```

**5.2** Copy the example config:
```bash
copy config\notion-config.example.json config\notion-config.json
```

**5.3** Open `config/notion-config.json` in a text editor

**5.4** Replace the placeholders with your actual values:
```json
{
  "notionApiKey": "secret_abc123def456...",  ← Your integration token from Step 1
  "databaseId": "abc123def456",              ← Your database ID from Step 4
  "autoSync": false,                          ← Keep false (manual sync)
  "syncOnProcess": false                      ← Keep false (manual sync)
}
```

**5.5** Save the file

**IMPORTANT**: `notion-config.json` is in `.gitignore` so your API key won't be committed to git.

---

## Step 6: Test Connection

**6.1** Run the test command:
```bash
npm run notion -- --test
```

**6.2** You should see:
```
======================================================================
Financial Command Center - Notion Sync
======================================================================

Testing Notion connection...
✓ Connected to database: "Financial Metrics Tracker"
  Database ID: abc123def456

Connection test successful!
Ready to sync financial data.
```

**6.3** If you see an error, see Troubleshooting section below

---

## Step 7: Sync Your First Data

**7.1** Process your financial data first (if you haven't already):
```bash
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf
npm run bank data/bank-statement-nov.pdf
```

**7.2** Run the sync:
```bash
npm run notion
```

**7.3** You should see:
```
Testing Notion connection...
✓ Connected to database: "Financial Metrics Tracker"

Found Quicken data: quicken-nov_quicken.json
Found QuickBooks data: November_quickbooks.json

✓ Loaded data from: Quicken, QuickBooks

Syncing to Notion...
✓ Successfully synced to Notion!

======================================================================
Notion page: https://notion.so/abc123
======================================================================

Data synced:
  Net Worth: $527,131
  Total Assets: $5,843
  Total Debt: $32,361
  Practice Revenue: $128,412
  Practice Net Income: $55,304
  Profit Margin: 43.1%
```

**7.4** Click the Notion page link to view your data

**7.5** Check your Notion database - you should see a new row with today's date and all metrics

---

## Step 8: Set Up Monthly Workflow

**Your new monthly routine**:

```bash
# First week of each month:

# 1. Process data sources
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf
npm run bank data/bank-statement-nov.pdf

# 2. Generate HTML dashboard (for detailed review)
npm run dashboard

# 3. Sync to Notion (for tracking and mobile access)
npm run notion

# 4. Review Notion views (built by Zephyr)
# Open Notion → Financial Metrics Tracker → Switch between views
```

**What this gives you**:
- Local HTML dashboard for deep analysis and sharing with advisor
- Notion database for trend tracking and mobile access
- Historical data for month-over-month comparison
- Progress tracking toward September 2026 milestone

---

## Troubleshooting

### Error: "Connection test failed: Unauthorized"

**Cause**: API key is invalid

**Fix**:
1. Double-check your API key in `config/notion-config.json`
2. Make sure you copied the entire token (starts with `secret_`)
3. Try regenerating the integration token at notion.so/my-integrations

---

### Error: "Connection test failed: Could not find database"

**Cause**: Database ID is wrong or integration doesn't have access

**Fix**:
1. Verify the database ID in `config/notion-config.json`
2. Make sure you shared the database with the integration (Step 3)
3. Try opening the database in Notion, check ⋯ menu → Connections

---

### Error: "Sync failed: Validation failed for property"

**Cause**: Database schema doesn't match expected properties

**Fix**:
1. Check that all required properties exist (see Step 2)
2. Verify property types match (e.g., "Profit Margin" should be Number, not Text)
3. Property names must match exactly (case-sensitive)
4. Run: `node src/sync_notion.js --test` to verify schema

---

### Error: "No financial data found"

**Cause**: No processed data files in `data/extracted/`

**Fix**:
1. Process at least one data source first:
   ```bash
   npm run quicken data/screenshots/quicken.png
   ```
2. Or specify files manually:
   ```bash
   node src/sync_notion.js --quicken data/extracted/file.json
   ```

---

### Error: "Failed to get schema"

**Cause**: Integration doesn't have access to the database

**Fix**:
1. Open database in Notion
2. Click ⋯ menu → Add connections
3. Select "Financial Command Center" integration
4. Retry: `npm run notion -- --test`

---

## Advanced Options

### Sync Specific Files

Instead of auto-finding the latest data:

```bash
node src/sync_notion.js --quicken data/extracted/october_quicken.json --quickbooks data/extracted/october_quickbooks.json
```

### Get Database Schema

To see what properties your database has:

```javascript
// Add this to src/sync_notion.js temporarily:
const schema = await notionSync.getDatabaseSchema();
console.log('Database schema:', JSON.stringify(schema, null, 2));
```

---

## Security Notes

**What's Private**:
- Your API key (`config/notion-config.json` is gitignored)
- Raw financial data (never leaves your machine)
- Detailed transactions (not synced)
- Account numbers (not synced)

**What's Synced**:
- Summary metrics only (net worth, revenue, etc.)
- No personally identifiable information
- No transaction detail

**Best Practices**:
- Keep `config/notion-config.json` local only
- Don't share your API key
- Notion integration has access only to shared database
- Revoke integration at notion.so/my-integrations if needed

---

## Database Schema Reference

See `NOTION-VIEWS-FOR-ZEPHYR.md` for:
- Complete property list
- Formula properties
- Recommended views
- Automations
- Rollup databases

---

## For Zephyr

When Janice hands off database creation:

1. Create database with schema from `NOTION-VIEWS-FOR-ZEPHYR.md`
2. Add all required properties
3. Add formula properties (debt payoff timeline, runway, etc.)
4. Build 7 recommended views
5. Set up color coding and automations
6. Share database ID with Janice for config
7. Verify first sync creates a row correctly

---

## Status: Ready to Connect

Once you complete these steps:

✅ Financial Command Center syncs metrics to Notion
✅ Zephyr can build custom views for tracking
✅ Mobile access to financial metrics via Notion app
✅ Automated tracking toward September 2026 milestone
✅ Historical data for trend analysis
✅ Integration with Quad Squad workflow

---

## Support

**If sync fails**:
1. Run: `npm run notion -- --test` to verify connection
2. Check database schema matches required properties
3. Verify integration has database access
4. Check troubleshooting section above

**For Zephyr**: See `NOTION-VIEWS-FOR-ZEPHYR.md` for database build instructions

**For Quad Squad**: Notion provides single source of truth for financial tracking accessible to all team members

---

**Next**: Process your November data and sync to Notion!

```bash
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf
npm run notion
```
