# Financial Command Center - Complete Parsers Guide

## Three Independent Financial Data Sources

Your Financial Command Center now processes **three distinct types** of financial data:

### 1. Personal Finances - Quicken Simplifi
**Purpose:** Net worth tracking, personal accounts
**Input:** Screenshots only (PNG/JPG)
**Tool:** `process_quicken.js`

### 2. Business Finances - QuickBooks
**Purpose:** Practice P&L, revenue/expenses
**Input:** PDF (preferred) or screenshots
**Tool:** `process_quickbooks.js`

### 3. Account Details - Bank Statements
**Purpose:** Transaction-level detail, cash flow patterns
**Input:** PDF (preferred) or screenshots
**Tool:** `process_bank.js`

---

## Why Three Separate Parsers?

**Different Data, Different Purposes:**

| Parser | Shows | Used For |
|--------|-------|----------|
| **Quicken** | Net worth snapshot, all accounts | Big picture: Where do I stand financially? |
| **QuickBooks** | Practice profitability | Business health: Is the practice sustainable? |
| **Bank Statements** | Transaction details | Cash flow patterns: Where is money actually going? |

**Tax & Legal Separation:**
- Quicken = Personal finances
- QuickBooks = Business finances
- Bank Statements = Can be either (business or personal accounts)

---

## Parser 1: Quicken Simplifi (Personal Finances)

### What It Extracts
- Net worth (total)
- Bank accounts (checking, savings)
- Credit card balances
- HELOC balance
- Total assets vs total debts
- Liquid assets available

### How to Use

```bash
# Take screenshot of Quicken dashboard
# Save to: data/screenshots/quicken-nov-2025.png

node src/process_quicken.js data/screenshots/quicken-nov-2025.png
```

### Output Example
```
Net Worth:                     $527,130.64
Total Assets:                  $5,843.15
Total Debt:                    -$32,360.66
Liquid Assets:                 $5,843.15

ASSET ACCOUNTS:
  360 Checking                 $5,639.43
  Embark Checking              $203.72

DEBT ACCOUNTS:
  Alaska Visa                  -$23,423.35
  Umpqua Credit Card           -$2,891.38
  HELOC                        -$74.94
```

### What It's Good For
- **Capital realignment planning** (September 2026)
- **Debt payoff strategy** (see all debts in one place)
- **Liquid assets calculation** (what's available for Solo 401k)
- **Monthly net worth tracking**

---

## Parser 2: QuickBooks (Business Finances)

### What It Extracts
- Total revenue by category
- Total expenses by category
- Net income & profit margin
- Practice sustainability assessment
- Annual projections
- Emergency reserve recommendations

### How to Use

```bash
# Export P&L as PDF from QuickBooks
# Save to: data/October.pdf

node src/process_quickbooks.js data/October.pdf

# Or use screenshot:
node src/process_quickbooks.js data/screenshots/quickbooks-oct.png
```

### Output Example (Your October Data)
```
Period:                        January 1-October 31, 2025

CURRENT PERIOD METRICS:
Total Revenue:                 $128,412.14
Total Expenses:                $73,107.83
Net Income:                    $55,304.31
Profit Margin:                 43.1%

ANNUAL PROJECTIONS:
Projected Annual Revenue:      $1,541,345.68
Projected Annual Expenses:     $877,293.96
Projected Annual Net Income:   $663,731.72

EXPENSE BREAKDOWN (Highest to Lowest):
  Home Office                  $51,615.96
  Medical Expenses             $7,874.91
  Interest Expense             $6,629.06
  Software Subscriptions       $3,337.44
  [... 13 more categories ...]

PRACTICE SUSTAINABILITY: EXCELLENT
Profit Margin: 43.1%
```

### What It's Good For
- **Solo 401(k) contribution planning** (based on practice net income)
- **Practice sustainability assessment** (is business healthy?)
- **Tax planning** (track deductible expenses)
- **Owner's draw decisions** (how much can you take?)
- **Monthly/quarterly profitability tracking**

---

## Parser 3: Bank Statements (Transaction Detail)

### What It Extracts
- Account information (bank, account #, type)
- Beginning & ending balances
- All transactions (date, description, amount)
- Transaction categorization (automatic)
- Cash flow patterns
- Fees & interest
- Category summaries

### How to Use

```bash
# Download bank statement PDF
# Save to: data/bank-statement-oct-2025.pdf

node src/process_bank.js data/bank-statement-oct-2025.pdf

# Or use screenshot:
node src/process_bank.js data/screenshots/bank-statement.png
```

### Output Example
```
Account Information:
  Bank: First National Test Bank
  Account Number: ****4892
  Account Type: Business Checking

Statement Period: October 1 - October 31, 2025

BALANCES:
Beginning Balance:             $8,234.56
Ending Balance:                $12,547.83
Change:                        +$4,313.27

CASH FLOW SUMMARY:
Total Deposits:                $6,450.00
Total Withdrawals:             $2,136.73
Net Cash Flow:                 +$4,313.27

TRANSACTIONS BY CATEGORY:
  Insurance Payment (2)        +$2,200.00
  Client Payment (2)           +$2,000.00
  Office Rent (1)              -$950.00
  Insurance Premium (1)        -$425.50
  [... more categories ...]

RECENT TRANSACTIONS:
10/28/2025   Insurance Payment - Anthem      +$1,250.00
10/25/2025   Client Payment                  +$875.00
10/22/2025   Office Rent                     -$950.00
[... more transactions ...]
```

### What It's Good For
- **Transaction-level detail** (what specifically was paid?)
- **Cash flow patterns** (when do deposits/withdrawals happen?)
- **Expense verification** (do QuickBooks categories match actual spending?)
- **Fee tracking** (how much are bank fees costing?)
- **Reconciliation** (match transactions to QuickBooks entries)

---

## How They Work Together

### Monthly Financial Review Workflow

**Step 1: High-Level View (Quicken)**
```bash
node src/process_quicken.js data/screenshots/quicken-nov.png
```
**Answer:** How's my overall financial health?

**Step 2: Business Performance (QuickBooks)**
```bash
node src/process_quickbooks.js data/November.pdf
```
**Answer:** Is the practice profitable? How much did I earn?

**Step 3: Transaction Detail (Bank Statements)**
```bash
node src/process_bank.js data/business-checking-nov.pdf
node src/process_bank.js data/personal-checking-nov.pdf
```
**Answer:** Where exactly did the money go? Any surprises?

### Capital Realignment Planning (September 2026)

**Quicken** → Personal debt balances to eliminate
**QuickBooks** → Practice income capacity for repayment
**Bank Statements** → Cash flow patterns to maintain

**Combined:** Optimal allocation of $150K land sale proceeds

### Solo 401(k) Planning

**QuickBooks** → Practice net income = contribution basis
**Quicken** → Retirement account balances
**Bank Statements** → Verify owner's compensation withdrawals

**Combined:** Maximize contributions while maintaining cash flow

### Tax Preparation

**QuickBooks** → Business deductions (Schedule C)
**Quicken** → Personal financial picture
**Bank Statements** → Transaction receipts & verification

**Combined:** Complete tax documentation

---

## File Organization

```
data/
├── October.pdf                      # QuickBooks P&L (business)
├── November.pdf                     # QuickBooks P&L (business)
├── bank-statement-oct-2025.pdf      # Bank statement (business or personal)
└── screenshots/
    ├── quicken-nov-2025.png         # Personal finances
    ├── quicken-dec-2025.png         # Personal finances
    └── [any other screenshots]

data/extracted/
├── October_quickbooks.json          # Parsed QuickBooks data
├── quicken-nov-2025_quicken.json    # Parsed Quicken data
└── bank-statement-oct-2025_bank.json # Parsed bank statement data
```

---

## Quick Reference Commands

### Personal Finances (Quicken)
```bash
node src/process_quicken.js data/screenshots/quicken-[date].png
```

### Business Finances (QuickBooks)
```bash
node src/process_quickbooks.js data/[month].pdf
```

### Bank Statements (Either)
```bash
node src/process_bank.js data/[bank-statement].pdf
```

### Debug/View Raw Text
```bash
node src/debug_pdf.js data/[any-pdf-file].pdf
```

---

## Best Practices

### For Quicken (Personal)
- **Screenshot monthly** - Track net worth changes
- **Capture full dashboard** - Include all accounts visible
- **Use consistent view** - Same Quicken screen each time

### For QuickBooks (Business)
- **Export monthly P&L as PDF** - More accurate than screenshots
- **Use consistent date range** - E.g., always January 1 - [current month]
- **Include all categories** - Don't filter expense categories

### For Bank Statements (Both)
- **Download PDF statements** - More accurate than screenshots
- **Keep business separate from personal** - Process separately
- **Process monthly** - Match to QuickBooks periods

---

## Data Separation (Tax & Legal)

**IMPORTANT:** Keep business and personal finances separate:

**Business:**
- QuickBooks P&L → Always business
- Business bank statements → Business checking account
- Practice-related credit cards → Business expenses

**Personal:**
- Quicken dashboard → Personal net worth
- Personal bank statements → Personal checking/savings
- Personal credit cards → Personal expenses

**Mixed:**
- Home office expenses → Can appear in both (prorated)
- Vehicle expenses → Can appear in both (business use %)
- Health insurance → Business deduction if self-employed

---

## Phase 3: What's Next

Once you have solid data from all three parsers, Phase 3 will build:

### Calculation Engines
- **Debt Payoff Calculator** (uses Quicken debt data)
- **Retirement Projections** (uses QuickBooks income + Quicken balances)
- **Capital Realignment Tracker** (uses all three sources)
- **Cash Flow Forecasting** (uses bank statement patterns)

### Dashboard Generation
- **Integrated Financial Dashboard** (combines all three)
- **Month-over-month comparisons**
- **Visual progress toward September 2026**
- **Solo 401(k) contribution optimizer**

---

## Summary

You now have **three powerful tools** that give you complete visibility into your finances:

| Tool | Data Source | Frequency | Purpose |
|------|-------------|-----------|---------|
| `process_quicken.js` | Quicken screenshots | Monthly | Personal net worth |
| `process_quickbooks.js` | QuickBooks PDF | Monthly | Practice profitability |
| `process_bank.js` | Bank statement PDF | Monthly | Transaction detail |

**All three are 100% local** - no cloud uploads, no API dependencies, complete privacy.

**All three save structured JSON** - ready for Phase 3 calculations and Phase 4 dashboards.

**All three work independently** - use one, two, or all three as needed.

---

**Financial Command Center Status:**
- ✅ Phase 1: OCR Foundation
- ✅ Phase 2: Platform Parsers (Quicken, QuickBooks, Bank Statements)
- ⏳ Phase 3: Calculation Engines
- ⏳ Phase 4: Dashboard Generation
- ⏳ Phase 5: Real Data Validation
- ⏳ Phase 6: Notion Integration
