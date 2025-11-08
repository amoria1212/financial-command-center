# Notion Setup V2 - Individual Account Tracking

**For**: Zephyr (Notion architect)
**Purpose**: Build the Account Tracker database for granular financial tracking
**Result**: Individual account rows with month-over-month tracking instead of worthless summary totals

---

## What Changed from V1

**V1 (Old - Worthless)**:
- Single row per month with summary totals only
- Total Debt: $32,361 (useless)
- Zero time savings

**V2 (New - Actually Useful)**:
- One row per account per month
- Alaska Visa: -$23,423 → -$22,000 (↓ $1,423)
- AMEX: -$2,082 → -$1,500 (↓ $582)
- Tracks individual debt payoff progress
- **Saves 25-30 min/month** of manual data entry

---

## Database to Build

### Database Name: "Account Tracker"

### Properties

| Property Name | Type | Purpose | Config |
|--------------|------|---------|--------|
| **Account Name** | Title | Name of account or category | - |
| **Date** | Date | When screenshot was taken | - |
| **Balance** | Number | Current balance (negative for debt) | Format: Dollar |
| **Type** | Select | Account/category type | See options below |
| **Category** | Select | Debt, Asset, or Business | Options: Debt, Asset, Business |
| **Source** | Select | Where data came from | Options: Quicken, QuickBooks |
| **Change from Last Month** | Number | Difference from previous month | Format: Dollar |
| **Period** | Text | For QuickBooks data (e.g., "Jan-Oct 2025") | Optional field |

### Type Select Options

Create these options for the **Type** property:
- Checking
- Savings
- Credit Card
- Credit Line
- Loan
- Investment
- Revenue
- Expense
- Other

### Colors (Recommended)

**Category property**:
- Debt → Red
- Asset → Green
- Business → Blue

**Type property**:
- Credit Card → Red
- Credit Line → Orange
- Revenue → Green
- Expense → Yellow
- Checking/Savings → Blue

---

## How Data Flows

### Example: November 2025 Sync

Janice takes Quicken screenshot → uploads to tool → creates these rows:

| Date | Account Name | Balance | Type | Category | Source | Change |
|------|-------------|---------|------|----------|--------|--------|
| 2025-11-08 | Alaska Visa | -$23,423 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | AMEX | -$2,082 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | Umpqua Credit Card | -$2,891 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | Business Spark Cash | -$2,082 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | Southwest CREDIT CARD | -$1,576 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | Amazon | -$227 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | HELOC | -$75 | Credit Line | Debt | Quicken | - |
| 2025-11-08 | VERE | -$2 | Credit Card | Debt | Quicken | - |
| 2025-11-08 | 360 Checking | $5,639 | Checking | Asset | Quicken | - |
| 2025-11-08 | Embark Checking | $204 | Checking | Asset | Quicken | - |
| 2025-11-08 | Discover | $0 | Credit Card | Asset | Quicken | - |

### Example: December 2025 Sync (Next Month)

Same accounts, but now with month-over-month changes calculated automatically:

| Date | Account Name | Balance | Type | Category | Source | Change |
|------|-------------|---------|------|----------|--------|--------|
| 2025-12-08 | Alaska Visa | -$22,000 | Credit Card | Debt | Quicken | **+$1,423 ↓** |
| 2025-12-08 | AMEX | -$1,500 | Credit Card | Debt | Quicken | **+$582 ↓** |
| 2025-12-08 | Umpqua Credit Card | -$2,500 | Credit Card | Debt | Quicken | **+$391 ↓** |
| ... | ... | ... | ... | ... | ... | ... |

**Change from Last Month** is automatically calculated by comparing to previous month's entry for the same account.

- Positive change for debt = debt paid down (good!)
- Negative change for debt = debt increased (bad!)

---

## QuickBooks Data (Business Categories)

Also syncs individual revenue/expense categories:

| Date | Account Name | Balance | Type | Category | Source | Period |
|------|-------------|---------|------|----------|--------|--------|
| 2025-11-08 | Revenue - Total Income | $163,652 | Revenue | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Revenue - Other Income | $10 | Revenue | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Expense - Home Office | $71,917 | Expense | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Expense - Interest Expense | $9,893 | Expense | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Expense - Utilities | $9,659 | Expense | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Expense - Medical Expenses | $4,975 | Expense | Business | QuickBooks | Jan-Dec 2024 |
| 2025-11-08 | Expense - Office Expenses | $4,222 | Expense | Business | QuickBooks | Jan-Dec 2024 |
| ... | ... | ... | ... | ... | ... | ... |

---

## Views to Build

### View 1: Debt Tracker
**Purpose**: Track debt payoff progress toward September 2026

**Filters**:
- Category = Debt
- Source = Quicken

**Sorting**:
- Date (descending)

**Grouping**:
- Group by Account Name

**Visible Properties**:
- Date
- Balance
- Change from Last Month
- Type

**Why**: See each debt account's history and paydown velocity

---

### View 2: Highest Debts
**Purpose**: Focus on accounts that need attention

**Filters**:
- Category = Debt
- Source = Quicken

**Sorting**:
- Balance (ascending - most negative first)

**Group**:
- None

**Visible Properties**:
- Account Name
- Balance
- Change from Last Month
- Date

**Filter to latest date only**: Add formula or manual filter

**Why**: See which debts are largest right now

---

### View 3: Fastest Paydown
**Purpose**: Verify avalanche strategy is working

**Filters**:
- Category = Debt
- Source = Quicken
- Change from Last Month > 0 (paid down)

**Sorting**:
- Change from Last Month (descending - biggest paydowns first)

**Visible Properties**:
- Account Name
- Change from Last Month
- Balance
- Date

**Why**: See which debts are being paid down fastest

---

### View 4: Asset Growth
**Purpose**: Track liquid assets for emergency fund and deployment

**Filters**:
- Category = Asset
- Source = Quicken

**Sorting**:
- Date (descending)

**Grouping**:
- Group by Account Name

**Visible Properties**:
- Date
- Balance
- Change from Last Month

**Why**: Track checking/savings growth

---

### View 5: Practice Revenue Trends
**Purpose**: Track business income over time

**Filters**:
- Type = Revenue
- Source = QuickBooks

**Sorting**:
- Date (descending)

**Grouping**:
- Group by Account Name

**Visible Properties**:
- Date
- Balance
- Period

**Why**: See revenue trends by category

---

### View 6: Practice Expense Breakdown
**Purpose**: Understand where practice money goes

**Filters**:
- Type = Expense
- Source = QuickBooks

**Sorting**:
- Balance (descending - highest expenses first)

**Filter to latest date**

**Visible Properties**:
- Account Name
- Balance
- Date
- Period

**Why**: See biggest expense categories

---

### View 7: September 2026 Dashboard
**Purpose**: All-in-one view for capital realignment tracking

**Filters**:
- Filter to most recent date only

**Grouping**:
- Group by Category (Debt, Asset, Business)

**Visible Properties**:
- Account Name
- Balance
- Change from Last Month
- Type

**Why**: Quick snapshot of current financial position

---

## Integration Setup (For Janice)

### Step 1: Create Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name: **Financial Command Center V2**
4. Type: Internal Integration
5. Copy the API key (starts with `secret_`)

### Step 2: Share Database with Integration

1. Open Account Tracker database
2. Click ⋯ menu → Add connections
3. Select "Financial Command Center V2"

### Step 3: Get Database ID

1. Open Account Tracker database in browser
2. Copy the ID from URL: `https://notion.so/workspace/DATABASE_ID?v=...`
3. The DATABASE_ID is the 32-character string

### Step 4: Configure Tool

1. Create `config/notion-config.json`:

```json
{
  "notionApiKey": "secret_xxxxx",
  "accountDatabaseId": "xxxxx",
  "autoSync": false,
  "syncOnProcess": false
}
```

### Step 5: Test Connection

```bash
node src/sync_notion.js --test
```

Should see: "Connected to database: Account Tracker"

### Step 6: Sync Data

```bash
# Process files first
npm run quicken data/screenshots/quicken-nov.png
npm run quickbooks data/November.pdf

# Sync to Notion
npm run notion
```

Should create 11+ rows (one per account) in Account Tracker database.

---

## Monthly Workflow

**First week of each month:**

1. Take Quicken screenshot (all accounts visible)
2. Export QuickBooks P&L PDF
3. Upload to web interface (http://localhost:3001)
4. Click "Sync to Notion"
5. Done - all account balances and changes synced automatically

**Time saved**: 25-30 minutes per month (no manual data entry)

---

## What Notion Receives vs. What Stays Local

### Synced to Notion (Account Tracker database):
- Individual account names (Alaska Visa, AMEX, etc.)
- Current balances
- Month-over-month changes
- Account types
- QuickBooks revenue/expense categories

### Stays Local (Never synced):
- Raw OCR text
- Screenshot files
- Transaction details
- Full QuickBooks reports
- Account numbers (if captured)

---

## Why This Matters

**Before (V1 - Worthless)**:
- "Total Debt: $32,361"
- Cannot track individual accounts
- No month-over-month comparison
- Manual entry still required
- Zero time savings

**After (V2 - Useful)**:
- 11 individual account rows with exact balances
- Automatic month-over-month change calculation
- Track Alaska Visa paydown: $23k → $22k → $21k
- See which debts paying down fastest
- **Saves 25-30 min/month**

**Strategic Value**:
- Track progress toward September 2026 capital realignment
- Verify debt avalanche strategy working (highest interest paid first)
- See which debts need extra payments
- Monitor liquid asset growth for deployment
- Data-driven decision making

---

## Questions?

**For Zephyr**:
- Does the database schema make sense?
- Any view recommendations to add?
- Any property types that should change?

**For Janice**:
- Confirm database name "Account Tracker" works
- Any additional properties needed?
- Any changes to view recommendations?

---

## Status: Ready to Build

Once Zephyr builds the Account Tracker database:
1. Janice gets the database ID
2. Janice configures config/notion-config.json
3. Janice runs sync
4. Tool creates 11+ rows automatically
5. Next month: sync again, see month-over-month changes
6. Strategic debt decisions powered by actual data

**This is what the tool was supposed to do from the start.**

---

**End of Setup Guide**
