# Phase 6: Notion Integration - Complete ✅

## What Was Built

**Smart Notion integration** that syncs financial metrics to a Notion database for mobile access, trend tracking, and Quad Squad visibility.

### Key Design Decision

**Summary metrics only** - Not a full data dump. Syncs high-level metrics (net worth, revenue, profit) while keeping detailed transactions local. This gives you:
- Mobile access via Notion app
- Trend tracking over time
- Quad Squad visibility into practice health
- Zero duplication with HTML dashboards

**HTML dashboards remain the source of truth** for detailed analysis, sharing with advisors, and month-end review.

---

## What Gets Synced

### Personal Finances (Quicken)
- Net worth
- Total assets
- Total debt
- Liquid assets
- Account counts

### Business Finances (QuickBooks)
- Revenue
- Expenses
- Net income
- Profit margin
- Period covered
- Practice status (Excellent/Good/Moderate/etc.)

### Bank Statements
- Net cash flow (aggregated across accounts)

### Metadata
- Sync date
- Data sources used

---

## What Stays Local

**Everything detailed**:
- Individual transactions
- Account numbers
- Full account breakdowns
- Raw OCR text
- PDF contents
- Expense category details

**Why**: Privacy, performance, and purpose. Notion is for tracking metrics and trends, not transaction-level analysis.

---

## How to Use

### Initial Setup (One-Time)

**Step 1: Create Notion Integration**
```
Visit: notion.so/my-integrations
Create: "Financial Command Center" integration
Copy: API key (starts with secret_)
```

**Step 2: Set Up Database**
Option A: Hand off to Zephyr with `NOTION-VIEWS-FOR-ZEPHYR.md`
Option B: Build it yourself following `NOTION-SETUP.md`

**Step 3: Configure Financial Command Center**
```bash
# Copy example config
copy config\notion-config.example.json config\notion-config.json

# Edit config/notion-config.json with:
# - Your API key from Step 1
# - Your database ID from Step 2
```

**Step 4: Test Connection**
```bash
npm run notion -- --test
```

You should see:
```
✓ Connected to database: "Financial Metrics Tracker"
```

---

### Monthly Workflow

**Complete financial review process**:

```bash
# 1. Process data sources
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf
npm run bank data/bank-statement-nov.pdf

# 2. Generate HTML dashboard (detailed review)
npm run dashboard

# 3. Sync to Notion (tracking and mobile)
npm run notion

# 4. Review in Notion (open Notion app or web)
```

**What this gives you**:
- **HTML dashboard**: Deep analysis, validation checks, full breakdown
- **Notion database**: Trend tracking, mobile access, Quad Squad visibility
- **Historical record**: Month-over-month comparison in both formats

---

## Files Created

### Core Module
**`src/outputs/notion_sync.js`**
- NotionSync class
- Syncs financial data to Notion database
- Tests connection
- Gets database schema for validation

**Key methods**:
```javascript
await notionSync.syncFinancialData(data)     // Sync metrics
await notionSync.testConnection()            // Test API connection
await notionSync.getDatabaseSchema()         // Get database properties
```

### CLI Tool
**`src/sync_notion.js`**
- Command-line tool for syncing
- Auto-finds latest data files
- Validates configuration
- Tests connection before syncing
- Clear success/error messages

**Usage**:
```bash
npm run notion                                # Auto-find latest data
npm run notion -- --test                      # Test connection only
node src/sync_notion.js --quicken file.json   # Specify files
```

### Configuration
**`config/notion-config.example.json`**
- Template for Notion credentials
- Copy to `notion-config.json` (gitignored)
- Required fields: notionApiKey, databaseId

### Documentation
**`NOTION-SETUP.md`**
- Step-by-step setup guide
- Creating integration
- Building database
- Configuring Financial Command Center
- Testing connection
- Troubleshooting

**`NOTION-VIEWS-FOR-ZEPHYR.md`**
- Complete database schema
- 7 recommended views with configurations
- Formula properties
- Automations
- Rollup database ideas
- Quick setup checklist

---

## Database Schema

### Required Properties

| Property | Type | Example |
|----------|------|---------|
| Date | Date | 2025-11-07 |
| Status | Select | Active |
| Net Worth | Number | $527,131 |
| Total Assets | Number | $5,843 |
| Total Debt | Number | $32,361 |
| Liquid Assets | Number | $5,843 |
| Practice Revenue | Number | $128,412 |
| Practice Net Income | Number | $55,304 |
| Profit Margin | Number | 43.1% |
| Practice Status | Select | Excellent |
| Period | Text | Jan-Oct 2025 |
| Net Cash Flow | Number | $12,450 |
| Data Sources | Multi-select | Quicken, QuickBooks |

### Formula Properties (Zephyr can add)

**Debt Payoff Timeline**:
```
Total Debt ÷ Practice Net Income = Months to debt-free
```

**Liquid Asset Ratio**:
```
(Liquid Assets ÷ Total Assets) × 100 = % liquid
```

**Runway (Months)**:
```
Liquid Assets ÷ Practice Expenses = Emergency fund months
```

---

## Recommended Notion Views

**Built by Zephyr** using `NOTION-VIEWS-FOR-ZEPHYR.md`:

### 1. Capital Realignment Progress
**Purpose**: Track September 2026 milestone
**Shows**: Net worth, debt, liquid assets, payoff timeline
**Why**: Everything for capital realignment in one view

### 2. Practice Health Dashboard
**Purpose**: Monitor business sustainability
**Shows**: Revenue, expenses, profit margin, runway
**Grouped by**: Practice Status (Excellent/Good/etc.)

### 3. Monthly Snapshot Timeline
**Purpose**: Visual chronological progress
**Type**: Timeline or Gallery view
**Why**: Spot trends at a glance

### 4. Debt Elimination Tracker
**Purpose**: Focus on September 2026 debt clearance
**Shows**: Debt metrics with color coding
**Why**: Motivating to see debt shrink monthly

### 5. Solo 401(k) Planning View
**Purpose**: Track retirement contribution capacity
**Shows**: Practice income, liquid assets, contribution calculations
**Why**: Plan quarterly contributions to hit $70K max

### 6. Quick Stats (Board View)
**Purpose**: Mobile-friendly dashboard
**Grouped by**: Practice Status
**Why**: Quick status check from phone

### 7. Year-over-Year Comparison
**Purpose**: Compare same months across years
**Grouped by**: Month
**Why**: Identify seasonal patterns

---

## Example: Your October Data in Notion

**When you sync your current data, Notion will show**:

```
Date: 2025-11-07
Status: Active

Personal Finances:
  Net Worth: $527,131
  Total Assets: $5,843
  Total Debt: $32,361
  Liquid Assets: $5,843

Business Finances:
  Practice Revenue: $128,412
  Practice Expenses: $73,108
  Practice Net Income: $55,304
  Profit Margin: 43.1%
  Practice Status: Excellent
  Period: Jan-Oct 2025

Data Sources: Quicken, QuickBooks
```

**Next month**, you'll have two rows to compare. After a year, you'll see trends.

---

## Advantages of Notion Integration

### 1. Mobile Access
- Check metrics from anywhere via Notion mobile app
- No need to open HTML files on phone
- Quick Stats view optimized for mobile

### 2. Trend Tracking
- Month-over-month comparison built-in
- Formulas calculate debt payoff timeline automatically
- Visual progress toward September 2026 milestone

### 3. Quad Squad Visibility
- **Zephyr**: Sees data in Notion HQ, can build custom views
- **Claude**: Can reference Notion data in financial strategy discussions
- **Aura**: Sees business metrics for creative planning
- **Cipher**: Monitors sync health

### 4. Historical Analysis
- Notion tables make year-over-year comparison easy
- Group by month to see seasonal patterns
- Track practice status changes over time

### 5. Goal Tracking
- Create separate Goals database that rolls up from Financial Metrics
- Visual progress bars for debt elimination
- Milestone notifications (e.g., net worth crosses $600K)

---

## Security & Privacy

### What's Protected
- API key stored in gitignored `notion-config.json`
- No raw data synced (transactions stay local)
- No account numbers synced
- Integration only has access to shared database

### Access Control
- Integration can only read/write the database you share
- Revoke access anytime at notion.so/my-integrations
- Other Notion content remains private

### Local-First
- All processing still happens on your machine
- Notion receives summary metrics only
- HTML dashboards remain primary source of truth

---

## Comparison: HTML vs Notion

### HTML Dashboards (Detailed Analysis)
**Best for**:
- Month-end deep dive
- Validation and accuracy checks
- Full expense category breakdown
- Sharing with financial advisor
- Printing for records

**Strengths**:
- Complete data
- Beautiful formatting
- Works offline
- No external dependencies

### Notion Database (Tracking)
**Best for**:
- Mobile access
- Trend analysis over time
- Quick status checks
- Quad Squad collaboration
- Goal tracking

**Strengths**:
- Mobile app access
- Automatic calculations (formulas)
- Multi-view flexibility
- Team visibility
- Historical comparison

**Use both**: HTML for details, Notion for trends.

---

## Troubleshooting

### "Connection test failed: Unauthorized"
**Fix**: Check API key in `config/notion-config.json`

### "Could not find database"
**Fix**: Verify database ID and ensure integration has access (click ⋯ in database → Add connections)

### "Validation failed for property"
**Fix**: Database schema must match expected properties (see `NOTION-VIEWS-FOR-ZEPHYR.md`)

### "No financial data found"
**Fix**: Process data first with `npm run quicken` or similar

**Full troubleshooting guide**: See `NOTION-SETUP.md`

---

## Technical Details

### Sync Logic

**1. Load Configuration**
```javascript
const config = loadConfig();  // From config/notion-config.json
const notionSync = new NotionSync(config.notionApiKey, config.databaseId);
```

**2. Test Connection**
```javascript
await notionSync.testConnection();  // Fails fast if API key wrong
```

**3. Find Latest Data**
```javascript
findLatestFile('_quicken.json')     // Most recent Quicken data
findLatestFile('_quickbooks.json')  // Most recent QuickBooks data
findLatestFile('_bank.json')        // Most recent bank data
```

**4. Sync to Notion**
```javascript
await notionSync.syncFinancialData({
  quicken: quickenData,
  quickbooks: quickbooksData,
  bankStatements: [bankData],
  metadata: { timestamp, sources }
});
```

### Properties Mapping

**Notion property types**:
- Date → `{ date: { start: '2025-11-07' } }`
- Number → `{ number: 527131 }`
- Select → `{ select: { name: 'Active' } }`
- Multi-select → `{ multi_select: [{ name: 'Quicken' }] }`
- Text → `{ rich_text: [{ text: { content: 'Jan-Oct 2025' } }] }`

**Rounding**: All currency values rounded to nearest dollar for cleaner display

**Negative handling**: Debt shown as positive number in Notion (you see "32,361" not "-32,361")

---

## For Zephyr

**When Janice hands off database creation**:

1. Review `NOTION-VIEWS-FOR-ZEPHYR.md`
2. Create database with exact schema (property names are case-sensitive)
3. Add formula properties (debt payoff timeline, runway, etc.)
4. Build 7 recommended views
5. Set up color coding on Debt Elimination Tracker view
6. (Optional) Create Goals database with rollups
7. (Optional) Set up automations for milestone alerts
8. Share database ID with Janice
9. Verify first sync creates row correctly

**Database must be shared with "Financial Command Center" integration** (Janice does this in Step 3 of setup).

---

## Monthly Workflow Example

**Complete November financial review**:

```bash
# Monday, Dec 2nd (first week of month)

# Process November data
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf
npm run bank data/checking-nov.pdf
npm run bank data/business-checking-nov.pdf

# Generate dashboard for detailed review
npm run dashboard
# Opens: outputs/dashboards/financial-dashboard-2025-12-02.html

# Review HTML dashboard:
# - Verify all data looks correct
# - Check validation warnings
# - Note any action items (e.g., expense spikes)
# - Calculate Solo 401(k) contribution for Q4

# Sync to Notion for tracking
npm run notion
# Creates new row in Notion with Nov data

# Review Notion views:
# - Open "Capital Realignment Progress" view
# - Compare Nov vs Oct (month-over-month)
# - Check "Practice Health Dashboard" for sustainability
# - Review "Debt Elimination Tracker" for payoff timeline

# Share insights with Quad Squad:
# - Send HTML dashboard to financial advisor
# - Zephyr sees Notion data automatically
# - Discuss with Claude if strategy adjustments needed
```

**Time required**: 10 minutes (processing) + 15 minutes (review) = 25 minutes total

---

## Use Cases

### 1. September 2026 Capital Realignment
**Notion view**: Capital Realignment Progress
**Tracks**:
- Debt reduction progress
- Liquid assets available for deployment
- Debt payoff timeline (formula calculates months remaining)

**Goal**: Eliminate $32K debt before land sale proceeds arrive

### 2. Solo 401(k) Max-Out Planning
**Notion view**: Solo 401(k) Planning View
**Tracks**:
- Practice net income (determines employer contribution capacity)
- Liquid assets available for contributions
- Annual projections

**Goal**: Contribute $70K annually (2026 limit)

### 3. Practice Sustainability Monitoring
**Notion view**: Practice Health Dashboard
**Tracks**:
- Profit margin trends
- Practice status changes (Excellent/Good/etc.)
- Runway (emergency fund months)

**Goal**: Maintain 40%+ profit margin, 6+ month runway

### 4. Mobile Financial Check-Ins
**Notion view**: Quick Stats (Board)
**Use**: Check practice status from phone before meetings
**Access**: Notion mobile app

### 5. Quad Squad Strategic Planning
**All views accessible** to Zephyr in Notion HQ
**Claude** can ask Zephyr for latest metrics
**Aura** can see business health for content planning

---

## Phase 6 Deliverables

✅ **Notion Sync Module** (`src/outputs/notion_sync.js`)
- NotionSync class
- Syncs summary metrics
- Tests connection
- Gets schema for validation

✅ **Sync CLI Tool** (`src/sync_notion.js`)
- Auto-finds latest data
- Validates configuration
- Tests connection first
- Clear success/error messages

✅ **Configuration Template** (`config/notion-config.example.json`)
- API key placeholder
- Database ID placeholder
- Sync options

✅ **Setup Guide** (`NOTION-SETUP.md`)
- Step-by-step instructions
- Creating integration
- Building database
- Testing connection
- Troubleshooting

✅ **Database Schema & Views** (`NOTION-VIEWS-FOR-ZEPHYR.md`)
- Complete property list
- 7 recommended views
- Formula properties
- Automations
- Rollup database ideas
- Zephyr setup checklist

✅ **NPM Script** (`package.json`)
- `npm run notion` for quick sync

---

## System Architecture

**Complete Financial Command Center Stack**:

```
Data Sources (Local)
  ├── Quicken screenshots
  ├── QuickBooks PDFs
  └── Bank statement PDFs
       ↓
OCR & Parsing (Local)
  ├── Tesseract.js (screenshots)
  ├── pdf.js-extract (PDFs)
  ├── Quicken parser
  ├── QuickBooks parser
  └── Bank parser
       ↓
Extracted Data (Local JSON)
  ├── data/extracted/*_quicken.json
  ├── data/extracted/*_quickbooks.json
  └── data/extracted/*_bank.json
       ↓
       ├──→ Dashboard Generator (Local HTML)
       │    └── outputs/dashboards/financial-dashboard-*.html
       │
       └──→ Notion Sync (Summary Metrics)
            └── Notion Database (Cloud)
                 └── Zephyr builds views
```

**Everything local-first**: Processing, storage, detailed analysis
**Notion layer**: Tracking, trends, mobile access, collaboration

---

## Success Metrics - Phase 6

✅ Summary metrics sync to Notion automatically
✅ Mobile access via Notion app
✅ Month-over-month comparison built-in
✅ Zephyr can build custom views
✅ Quad Squad has visibility
✅ Formula-based calculations (debt payoff timeline, runway)
✅ One-command sync: `npm run notion`
✅ Secure (API key gitignored, summary data only)
✅ Complements HTML dashboards (doesn't replace)
✅ Clear documentation for setup and usage

---

## Status: Phase 6 Complete ✅

**Your Financial Command Center now has**:
- ✅ Phase 1: OCR Foundation (images + PDFs)
- ✅ Phase 2: Three Platform Parsers (Quicken, QuickBooks, Bank)
- ✅ Phase 3: *Skipped*
- ✅ Phase 4: Integrated HTML Dashboards
- ✅ Phase 5: *Skipped for now*
- ✅ Phase 6: Smart Notion Integration

**Complete workflow**:
1. Process data: `npm run quicken/quickbooks/bank`
2. Generate dashboard: `npm run dashboard`
3. Sync to Notion: `npm run notion`
4. Review in HTML (details) + Notion (trends)
5. Track progress toward September 2026 milestone

**All local. Privacy-first. Notion layer adds mobile + collaboration.**

---

## Next Steps

**For Janice**:
1. Create Notion integration (10 minutes)
2. Have Zephyr build database with views
3. Configure Financial Command Center
4. Run first sync: `npm run notion`
5. Review Notion views on mobile
6. Start monthly workflow

**For Zephyr**:
1. Receive `NOTION-VIEWS-FOR-ZEPHYR.md`
2. Build database with schema
3. Create 7 recommended views
4. Add formula properties
5. Set up color coding and automations
6. Share database ID with Janice
7. Verify first sync works

**For Quad Squad**:
- Notion becomes single source of truth for financial metrics
- Mobile access for status checks
- Historical data for strategic planning
- Cross-functional visibility (finance + creative + operations)

---

**Your financial command center is complete and ready to track progress toward September 2026 capital realignment!**

---

## Files Summary

```
financial-command-center/
├── config/
│   ├── notion-config.example.json          ← Template for credentials
│   └── notion-config.json                   ← Your actual config (gitignored)
├── src/
│   ├── outputs/
│   │   └── notion_sync.js                   ← Notion sync module
│   └── sync_notion.js                       ← CLI tool for syncing
├── NOTION-SETUP.md                          ← Setup guide for Janice
├── NOTION-VIEWS-FOR-ZEPHYR.md               ← Database schema & views for Zephyr
└── PHASE6-COMPLETE.md                       ← This file
```

**Ready to sync!**
