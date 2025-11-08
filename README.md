# Financial Command Center

> Screenshot-based financial dashboard generator for solo practice owners

## What It Does

Transforms screenshots of your financial dashboards into actionable insights:
- **Debt Payoff Tracker** → Know exactly when you'll be debt-free
- **Retirement Projections** → See if you're on track for age 72-75 retirement
- **Capital Realignment Dashboard** → September 2026 milestone tracking
- **Practice Sustainability** → Revenue, expenses, and net income trends

## Why Screenshots?

- ✅ Works with ANY financial platform (Quicken, QuickBooks, banks)
- ✅ No API keys or integrations to maintain
- ✅ Vendor-independent (platforms can change, screenshots always work)
- ✅ Private (all processing happens on your machine)

## Installation

### Prerequisites

**1. Claude Code CLI** (you already have this)
```bash
claude --version  # Verify it's installed
```

**2. OCR Engine (Tesseract)**

*Windows:*
```powershell
# Download installer
# https://github.com/UB-Mannheim/tesseract/wiki

# Run the installer
# Add to PATH: C:\Program Files\Tesseract-OCR

# Verify
tesseract --version
```

*Mac:*
```bash
brew install tesseract
tesseract --version
```

*Linux:*
```bash
sudo apt-get install tesseract-ocr
tesseract --version
```

**3. Python or Node.js**

*Check if you have either:*
```bash
python --version  # or python3 --version
node --version
```

*If neither, install Node.js from:* https://nodejs.org

### Project Setup

**1. Clone/Create Project Folder**
```bash
mkdir ~/financial-command-center
cd ~/financial-command-center
```

**2. Copy Handoff Files** (if you received them)
Place these files in the project root:
- `PROJECT_OVERVIEW.md`
- `DEVELOPMENT_LOG.md`
- `GEMINI_QUICK_START.md`
- `README.md` (this file)
- `TROUBLESHOOTING.md`

**3. Create Folder Structure**
```bash
mkdir -p src/{ocr,processors,calculators,outputs}
mkdir -p data/{screenshots,extracted,archives}
mkdir -p outputs/{dashboards,exports}
mkdir -p tests/{sample_data,test_cases}
mkdir -p config
```

**4. Install Dependencies**

*For Python:*
```bash
pip install pytesseract pillow opencv-python pandas notion-client
```

*For Node.js:*
```bash
npm install tesseract.js sharp canvas notion-client
```

## Quick Start

### Step 1: Take Screenshots

**What to capture:**
- Quicken Simplifi dashboard (overall balances view)
- QuickBooks profit & loss screen
- Bank account balances page
- Credit card statements (current balance visible)

**Tips:**
- Full screen for best quality
- Good lighting (avoid glare on monitors)
- Ensure all numbers are clearly visible
- Save as PNG or JPG

**Save them to:**
```
~/financial-command-center/data/screenshots/
```

**Naming convention:**
- `quicken_2025-11-06.png`
- `quickbooks_2025-11-06.png`
- `chase_checking_2025-11-06.png`
- `amex_2025-11-06.png`

### Step 2: Configure Accounts (First Time Only)

**Create `config/accounts.json`:**
```json
{
  "debt_accounts": [
    {
      "name": "Amex Blue",
      "type": "credit_card",
      "interest_rate": 19.99,
      "current_balance": 0,
      "minimum_payment": 0,
      "priority": 1
    },
    {
      "name": "Chase Sapphire",
      "type": "credit_card",
      "interest_rate": 21.49,
      "current_balance": 0,
      "minimum_payment": 0,
      "priority": 2
    }
  ],
  "retirement_accounts": [
    {
      "name": "Solo 401(k)",
      "type": "401k",
      "current_balance": 0,
      "annual_contribution_limit": 69000,
      "ytd_contributions": 0
    }
  ],
  "practice_accounts": [
    {
      "name": "Practice Checking",
      "type": "checking",
      "current_balance": 0
    },
    {
      "name": "Practice Savings",
      "type": "savings",
      "current_balance": 0
    }
  ]
}
```

**Create `config/goals.json`:**
```json
{
  "retirement": {
    "target_age": 72,
    "current_age": 57,
    "annual_return": 7.0,
    "target_balance": 1500000
  },
  "debt_payoff": {
    "strategy": "avalanche",
    "extra_monthly_payment": 500
  },
  "capital_realignment": {
    "date": "2026-09-01",
    "amount": 150000,
    "allocation": {
      "debt_payoff": 0.4,
      "retirement": 0.3,
      "reserves": 0.3
    }
  }
}
```

### Step 3: Run the Tool

**Basic usage:**
```bash
# Python
python src/main.py

# Node.js
node src/index.js
```

**With options:**
```bash
# Process specific screenshot
python src/main.py --screenshot data/screenshots/quicken_2025-11-06.png

# Generate specific dashboard
python src/main.py --dashboard retirement

# Skip Notion sync
python src/main.py --no-notion-sync
```

### Step 4: View Results

**Dashboards are saved to:**
```
outputs/dashboards/financial_dashboard_2025-11-06.html
outputs/dashboards/financial_dashboard_2025-11-06.md
```

**Open in browser:**
```bash
# Mac/Linux
open outputs/dashboards/financial_dashboard_2025-11-06.html

# Windows
start outputs/dashboards/financial_dashboard_2025-11-06.html
```

## Usage Patterns

### Weekly Check-In (Recommended)

**Every Monday morning:**
1. Take fresh screenshots of all accounts (5 min)
2. Save to `data/screenshots/` with today's date
3. Run: `python src/main.py` (30 sec)
4. Review dashboard over coffee (5 min)
5. Adjust spending/savings if needed

**Total time:** 10 minutes

### Monthly Deep Dive

**First of each month:**
1. Run weekly check-in (above)
2. Review historical trends: `python src/main.py --compare-months 3`
3. Update goals if needed (edit `config/goals.json`)
4. Export to Notion: `python src/main.py --notion-sync`

**Total time:** 20 minutes

### Quarterly Planning

**Every 3 months:**
1. Run monthly deep dive (above)
2. Generate projection report: `python src/main.py --projections-report`
3. Review debt payoff progress vs. plan
4. Adjust retirement contribution if needed
5. Share with financial advisor (export PDF)

**Total time:** 45 minutes

## Understanding the Dashboard

### Debt Payoff Section

```
🔴 High Priority Debt
┌─────────────────────────────────────────────────┐
│ Amex Blue (21.49% APR)                          │
│ Balance: $5,234.00                              │
│ Minimum: $157 | Recommended: $657              │
│ Payoff: June 2026 (8 months) with extra $500   │
└─────────────────────────────────────────────────┘
```

**What it means:**
- **High Priority** = Highest interest rate, pay this first
- **Minimum** = Required payment (don't pay only this!)
- **Recommended** = Minimum + extra payment from goals
- **Payoff date** = When you'll be free if you stick to plan

### Retirement Projection Section

```
📈 Retirement Trajectory
Current (age 57): $125,000
Target (age 72): $1,500,000

On Track: ✅ YES (with current contribution rate)
Required: $3,500/month
Actual: $4,000/month
Surplus: $500/month

Projected at age 72: $1,620,000 (+8% buffer)
```

**What it means:**
- **On Track** = You're meeting or exceeding targets
- **Required** = Minimum contribution to hit goal
- **Actual** = What you're currently contributing
- **Surplus** = Room to reduce (or pad buffer)

### Capital Realignment Countdown

```
⏳ September 2026 Land Sale
Days remaining: 302 days
Planned allocation: $150,000

Distribution Plan:
├─ Debt Payoff: $60,000 (40%)
├─ Retirement: $45,000 (30%)
└─ Reserves: $45,000 (30%)

Impact on Goals:
• Debt-free date: Moves up 14 months
• Retirement buffer: +$198,000 by age 72
```

**What it means:**
- **Countdown** = Reminder to prepare
- **Allocation** = Where the money goes
- **Impact** = How it accelerates your goals

## Troubleshooting

### "Tesseract not found"

**Fix:** Install Tesseract (see Installation section) and add to PATH

### OCR Results are Inaccurate

**Try these:**
1. Retake screenshot at higher resolution
2. Increase monitor brightness
3. Zoom in before taking screenshot
4. Use manual verification mode: `--verify-amounts`

### Missing Data in Dashboard

**Check:**
1. Screenshot includes all account balances?
2. `config/accounts.json` lists all accounts?
3. Log file for extraction errors: `logs/extraction.log`

### Notion Sync Fails

**Verify:**
1. Notion API token in `.env` file
2. Database ID is correct
3. Database has required properties (see Notion Integration section)

**More help:** See `TROUBLESHOOTING.md` for complete guide

## Advanced Features

### Custom Projections

**Scenario planning:**
```bash
# What if I increase retirement contribution?
python src/main.py --scenario retirement_boost=5000

# What if I pay off debt faster?
python src/main.py --scenario extra_debt_payment=1000

# What if market returns are lower?
python src/main.py --scenario annual_return=5.0
```

### Historical Analysis

**Track trends over time:**
```bash
# Compare this month to last 3 months
python src/main.py --compare-months 3

# Show year-over-year progress
python src/main.py --compare-annual

# Export all historical data to CSV
python src/main.py --export-history
```

### Notion Integration

**Auto-sync to Notion workspace:**

**1. Set up Notion database** (one time)
- Create database with these properties:
  - Date (date)
  - Total Debt (number)
  - Retirement Balance (number)
  - Net Practice Income (number)
  - On Track (checkbox)

**2. Get Notion API credentials**
- Go to https://www.notion.so/my-integrations
- Create integration
- Copy "Internal Integration Token"
- Share database with integration

**3. Configure sync**

Create `.env` file:
```
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx
```

**4. Enable auto-sync**
```bash
python src/main.py --notion-sync
```

Now every run auto-updates Notion!

## Backup & Data Management

### Recommended Backup Strategy

**Weekly:** (automatic)
- Screenshots archived to `data/archives/YYYY-MM/`
- Dashboard snapshots saved to `outputs/archives/`

**Monthly:** (manual)
- Backup entire project folder to external drive
- Export Notion data to CSV (redundancy)

**Quarterly:** (manual)
- Upload archives to cloud storage (encrypted)

### Data Retention

**Keep:**
- Last 12 months of screenshots
- All dashboards (they're small)
- Historical trends data

**Archive:**
- Screenshots older than 12 months → external drive
- Dashboard older than 24 months → compressed

**Delete:**
- Nothing! Storage is cheap, data is valuable

## Performance Tips

### Faster Processing

**1. Pre-process screenshots** (save processing time)
```bash
python src/utils/optimize_images.py data/screenshots/
```

**2. Batch processing** (do all at once)
```bash
python src/main.py --batch data/screenshots/*.png
```

**3. Cache results** (skip unchanged screenshots)
```bash
python src/main.py --use-cache
```

### Better Accuracy

**1. Consistent screenshot format**
- Same zoom level each time
- Same time of day (fewer popups/alerts)
- Full screen, no overlapping windows

**2. High-quality captures**
- 1920x1080 minimum resolution
- PNG format (better than JPG)
- No compression

**3. Manual verification mode**
```bash
python src/main.py --verify-all
```
Prompts you to confirm each extracted amount

## Security & Privacy

### What Gets Stored

**Locally (on your machine):**
- Screenshots (raw financial data)
- Extracted data (JSON format)
- Generated dashboards

**In Notion (if synced):**
- Aggregate metrics only (total debt, retirement balance)
- No account numbers, no transaction details
- No personally identifiable financial data

**Never stored anywhere:**
- Bank passwords
- Account login credentials
- Full account numbers
- Social Security numbers

### Best Practices

1. **Encrypt your hard drive** (Windows BitLocker, Mac FileVault)
2. **Use strong Notion passwords** (if syncing)
3. **Don't commit screenshots to git** (already in .gitignore)
4. **Regularly backup encrypted** (see Backup section)

## Getting Help

### Quick Reference

**Command help:**
```bash
python src/main.py --help
```

**Configuration help:**
```bash
python src/main.py --show-config
```

**Diagnostic check:**
```bash
python src/main.py --check-system
```

### Documentation

- **Full context:** `PROJECT_OVERVIEW.md`
- **Development log:** `DEVELOPMENT_LOG.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Gemini handoff:** `GEMINI_QUICK_START.md`

### Support

**For Janice:** Ask Claude or Gemini during a session

**For developers:** Refer to `DEVELOPMENT_LOG.md` and code comments

## Roadmap

### Version 1.0 (Current Development)
- [x] Project architecture
- [x] Documentation
- [ ] OCR foundation
- [ ] Data extraction
- [ ] Calculation engine
- [ ] Dashboard generation
- [ ] Real data validation
- [ ] Notion integration

### Version 1.1 (Future)
- [ ] Mobile-optimized dashboards
- [ ] Email summary reports
- [ ] Automated screenshot capture
- [ ] Multi-currency support

### Version 2.0 (Aspirational)
- [ ] Mobile app
- [ ] Voice commands ("Hey Claude, update finances")
- [ ] Predictive insights (ML-based)

## License

Private use only for Janice LaFountaine's therapy practice.

## Credits

- **Architecture:** Claude (Anthropic AI)
- **Implementation:** Claude + Gemini (backup)
- **Product Owner:** Janice LaFountaine, LMFT
- **Operations Lead:** Zephyr (Notion Assistant)
- **Creative Strategy:** Aura (Gemini Assistant)

Built with love and the Quad Squad 4.0 philosophy: *Excellence should feel effortless.*

---

**End of README**

*For detailed context, see PROJECT_OVERVIEW.md*
*For development history, see DEVELOPMENT_LOG.md*
*For Gemini handoffs, see GEMINI_QUICK_START.md*
