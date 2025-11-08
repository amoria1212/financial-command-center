# Notion Views for Zephyr

**Purpose**: Example Notion database views that Zephyr can build for tracking financial metrics synced from the Financial Command Center.

**Context**: Financial data flows automatically from processing tools → Notion database. These views help visualize trends, track progress toward September 2026 capital realignment, and monitor practice sustainability.

---

## Database Schema

**Database Name**: Financial Metrics Tracker

### Required Properties

| Property Name | Type | Purpose |
|---------------|------|---------|
| Date | Date | When this data was captured |
| Status | Select | Active/Archived (for hiding old data) |
| Net Worth | Number | Total net worth (Quicken) |
| Total Assets | Number | All assets combined (Quicken) |
| Total Debt | Number | All debt combined (Quicken) |
| Liquid Assets | Number | Cash available for deployment (Quicken) |
| Asset Accounts | Number | Count of asset accounts (Quicken) |
| Debt Accounts | Number | Count of debt accounts (Quicken) |
| Practice Revenue | Number | Business revenue (QuickBooks) |
| Practice Expenses | Number | Business expenses (QuickBooks) |
| Practice Net Income | Number | Business profit (QuickBooks) |
| Profit Margin | Number | Profit margin percentage (QuickBooks) |
| Practice Status | Select | Excellent/Good/Moderate/Marginal/Concerning |
| Period | Text | Period covered (e.g., "Jan-Oct 2025") |
| Net Cash Flow | Number | Bank statement net cash flow |
| Data Sources | Multi-select | Which sources were synced (Quicken, QuickBooks, Bank Statements) |

### Formula Properties (Zephyr can add)

| Property Name | Formula | Purpose |
|---------------|---------|---------|
| Month-over-Month Net Worth | Calculate difference from previous entry | Track net worth growth |
| Debt Payoff Timeline | `prop("Total Debt") / prop("Practice Net Income")` | Months to eliminate debt at current income |
| Liquid Asset Ratio | `prop("Liquid Assets") / prop("Total Assets")` * 100 | % of assets that are liquid |
| Runway (Months) | `prop("Liquid Assets") / prop("Practice Expenses")` | Emergency fund in months |

---

## View 1: Capital Realignment Progress

**Purpose**: Track progress toward September 2026 milestone (eliminate debt, max Solo 401(k), build reserve)

**View Type**: Table

**Filters**:
- Status = Active

**Sorting**:
- Date (descending - newest first)

**Grouping**:
- None

**Visible Properties** (in this order):
1. Date
2. Net Worth
3. Total Debt
4. Liquid Assets
5. Practice Net Income
6. Debt Payoff Timeline (formula)
7. Data Sources

**Why This View**:
Shows the three critical numbers for capital realignment at a glance: where you stand (net worth), what needs clearing (debt), and what's available to deploy (liquid assets). Timeline calculation answers "how long until debt-free?"

---

## View 2: Practice Health Dashboard

**Purpose**: Monitor business sustainability and profitability trends

**View Type**: Table

**Filters**:
- Status = Active
- Data Sources contains QuickBooks

**Sorting**:
- Date (descending)

**Grouping**:
- Practice Status (groups by Excellent/Good/Moderate/etc.)

**Visible Properties**:
1. Date
2. Period
3. Practice Revenue
4. Practice Expenses
5. Practice Net Income
6. Profit Margin
7. Practice Status
8. Runway (Months) (formula)

**Why This View**:
Focuses exclusively on business metrics. Grouping by Practice Status lets you see when profitability dips or improves. Runway calculation shows emergency fund strength.

---

## View 3: Monthly Snapshot Timeline

**Purpose**: See all metrics chronologically for trend analysis

**View Type**: Timeline (if available) or Gallery

**Filters**:
- Status = Active

**Sorting**:
- Date (ascending - chronological)

**Card Preview** (if Gallery view):
- Cover: None
- Title: Date
- Properties shown:
  - Net Worth
  - Total Debt
  - Practice Net Income
  - Profit Margin

**Why This View**:
Visual timeline showing monthly progress. Quickly spot trends (is net worth growing? Is debt shrinking? Is profit margin stable?).

---

## View 4: Debt Elimination Tracker

**Purpose**: Focused view for September 2026 debt clearance goal

**View Type**: Table

**Filters**:
- Status = Active
- Total Debt < 0 (only show entries with debt data)

**Sorting**:
- Date (descending)

**Visible Properties**:
1. Date
2. Total Debt
3. Debt Accounts
4. Practice Net Income
5. Liquid Assets
6. Debt Payoff Timeline (formula)

**Color Coding** (Zephyr can set):
- Total Debt: Red background
- Debt Accounts: Orange if > 3, green if ≤ 2
- Debt Payoff Timeline: Green if < 6 months, yellow if 6-12 months, red if > 12 months

**Why This View**:
Laser-focused on debt metrics. Seeing debt shrink month-over-month is motivating. Timeline calculation provides concrete target.

---

## View 5: Solo 401(k) Planning View

**Purpose**: Track income and liquid assets for retirement contribution planning

**View Type**: Table

**Filters**:
- Status = Active
- Data Sources contains QuickBooks

**Sorting**:
- Date (descending)

**Visible Properties**:
1. Date
2. Period
3. Practice Net Income
4. Liquid Assets
5. Net Worth
6. Data Sources

**Manual Columns Zephyr Can Add**:
- **Max Employee Contribution** (manual entry): $23,500 for 2026
- **Max Employer Contribution** (formula): `min(prop("Practice Net Income") * 0.25, 46500)` (25% of net income, capped at $46,500)
- **Total 401(k) Capacity** (formula): Sum of employee + employer contribution
- **Current 401(k) Contributions** (manual entry): Track what's been contributed

**Why This View**:
Shows how much practice income supports Solo 401(k) contributions. Helps plan quarterly contributions to hit $70K annual max by year-end.

---

## View 6: Quick Stats (Board View)

**Purpose**: High-level dashboard for mobile access

**View Type**: Board

**Grouping**:
- Practice Status

**Sorting**:
- Date (descending)

**Card Preview**:
- Title: Date
- Properties shown:
  - Net Worth
  - Total Debt
  - Practice Net Income
  - Profit Margin

**Why This View**:
Mobile-friendly view for quick status checks. Board grouping by Practice Status provides instant health assessment. Perfect for checking from phone during financial advisor meetings.

---

## View 7: Year-over-Year Comparison

**Purpose**: Compare same month across different years

**View Type**: Table

**Filters**:
- Status = Active

**Sorting**:
- Date (descending)

**Grouping**:
- Month (extract month from Date property)

**Visible Properties**:
1. Date
2. Net Worth
3. Practice Revenue
4. Practice Net Income
5. Total Debt
6. Profit Margin

**Why This View**:
Grouped by month, this view lets you compare October 2025 vs October 2024 (once you have multi-year data). Identifies seasonal patterns in practice revenue.

---

## Recommended Automations (Zephyr can build)

### 1. Low Profit Margin Alert
**Trigger**: When Profit Margin < 30%
**Action**: Send notification or change Status to "Review Needed"

### 2. Net Worth Milestone
**Trigger**: When Net Worth crosses $600K, $700K, $800K milestones
**Action**: Celebrate! Add a comment or emoji

### 3. Debt-Free Countdown
**Trigger**: When Total Debt > -$10,000 (getting close to $0)
**Action**: Highlight the row or send notification

---

## Database Rollup (Optional Advanced)

If Zephyr wants to create a **separate "Goals" database**:

**Goals Database Properties**:
- Goal Name (Title): "Debt Elimination", "Max 401(k) 2026", "Emergency Reserve"
- Target Amount (Number)
- Target Date (Date)
- Status (Select): On Track / At Risk / Complete
- Related Metrics (Relation to Financial Metrics Tracker)

**Example Rollup**:
- Goal: "Debt Elimination"
- Target Amount: $0
- Target Date: September 2026
- Rollup: `min()` of Total Debt from related Financial Metrics entries
- Progress Bar: Visual indicator of debt reduction

---

## Quick Setup Checklist for Zephyr

- [ ] Create "Financial Metrics Tracker" database in Notion HQ
- [ ] Add all required properties (see schema above)
- [ ] Add formula properties (Month-over-Month Net Worth, Debt Payoff Timeline, Liquid Asset Ratio, Runway)
- [ ] Create View 1: Capital Realignment Progress
- [ ] Create View 2: Practice Health Dashboard
- [ ] Create View 3: Monthly Snapshot Timeline
- [ ] Create View 4: Debt Elimination Tracker
- [ ] Create View 5: Solo 401(k) Planning View
- [ ] Create View 6: Quick Stats (Board View)
- [ ] Create View 7: Year-over-Year Comparison
- [ ] Set up color coding on Debt Elimination Tracker
- [ ] (Optional) Create Goals database with rollups
- [ ] (Optional) Set up automations for milestones
- [ ] Share database with Financial Command Center integration
- [ ] Send database ID to Janice for config

---

## Notes for Janice

Once Zephyr builds these views:

1. **Run your first sync**:
   ```bash
   npm run notion
   ```

2. **Verify data appears** in Notion database

3. **Choose your primary view** - probably "Capital Realignment Progress" or "Practice Health Dashboard"

4. **Set up mobile access** - Notion mobile app makes "Quick Stats" view perfect for on-the-go

5. **Monthly workflow**:
   - Process Quicken screenshot
   - Process QuickBooks PDF
   - Process bank statements
   - Run: `npm run dashboard` (for detailed HTML review)
   - Run: `npm run notion` (to sync metrics to Notion)
   - Review trends in Notion views

6. **Share with Zephyr** - Zephyr can see the data too and provide strategic insights based on trends

---

## Why This Setup Works

**For Janice**:
- Mobile access to financial metrics anywhere
- Visual trend tracking toward September 2026 milestone
- Automated calculations (debt payoff timeline, runway, etc.)
- Clean, organized views vs raw data

**For Zephyr**:
- Data flows automatically from Financial Command Center
- No manual data entry
- Clear schema to build against
- Flexibility to create custom views as needed

**For the Quad Squad**:
- Claude can reference Notion data for financial strategy discussions
- Aura can see business metrics for creative planning
- Cipher keeps the sync working smoothly

---

**Status**: Ready for Zephyr to build database and views in Notion HQ.

**Next Step**: Janice creates Notion integration, Zephyr builds database, Financial Command Center starts syncing.
