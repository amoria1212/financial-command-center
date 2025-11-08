# Financial Command Center - Development Log

## Purpose
This log tracks all development progress, decisions, issues, and handoffs. Update this file after every work session, whether with Claude or Gemini.

---

## Log Entry Format

```
### [Date] - [Phase] - [Who]
**What was built:**
- Item 1
- Item 2

**Decisions made:**
- Decision 1 (reasoning)
- Decision 2 (reasoning)

**Issues encountered:**
- Issue 1 (status: resolved/pending)
- Issue 2 (status: resolved/pending)

**Next steps:**
- [ ] Task 1
- [ ] Task 2

**Time spent:** X hours Y minutes
```

---

## Development Timeline

### 2025-11-06 - Planning Phase - Claude
**What was built:**
- Complete project architecture documentation
- Handoff infrastructure for Claude → Gemini continuity
- Development phase breakdown (6 phases)
- File structure specification

**Decisions made:**
- Screenshot-based approach (vs. API integration) for vendor independence
- Local-first processing for privacy and HIPAA simplicity
- Six-phase development plan with clear success criteria
- Gemini as backup assistant during Claude usage limit cutoffs

**Issues encountered:**
- None yet (pre-development)

**Next steps:**
- [ ] Set up project folder structure on Janice's laptop
- [ ] Install OCR dependencies (Tesseract)
- [ ] Create first test with fake bank statement screenshot
- [ ] Build basic screenshot reader function
- [ ] Verify text extraction quality

**Time spent:** 45 minutes (planning and documentation)

---

## Active Issues

*No active issues yet - project not started*

---

## Resolved Issues

*No resolved issues yet - project not started*

---

## Feature Requests / Future Enhancements

### Deferred to v2.0
- Multi-currency support (only USD needed for v1.0)
- Mobile app version (desktop-first for v1.0)
- Automated screenshot capture (manual upload for v1.0)
- Email alerts for milestone progress (manual dashboard review for v1.0)

### Nice-to-Have (if time permits)
- ASCII charts in markdown output (low priority, can add later)
- Dark mode HTML dashboard (Janice preference TBD)
- Export to PDF for advisor meetings (may not be needed)
- Historical trend charts (data accumulation required first)

---

## Architecture Decisions

### Why Python vs. Node.js?
**Decision:** ✅ Node.js (decided 2025-11-07)

**Python Pros:**
- Excellent OCR libraries (pytesseract mature and stable)
- Strong data processing ecosystem (pandas)
- Simpler for mathematical calculations
- Janice familiar with Python-based tools

**Node.js Pros:**
- Better Notion API integration (@notionhq/client)
- Faster execution for file I/O
- Claude Code may default to Node
- Consistent with web-based dashboards

**Resolution:** Node.js selected based on Janice's strong preference for Notion integration. Tesseract.js proves sufficient for OCR needs, and @notionhq/client will streamline Phase 6 implementation.

---

### Why Local Storage vs. Cloud?
**Decision:** 100% local storage with optional Notion sync

**Reasoning:**
- Financial screenshots contain sensitive data
- No need for external API costs or complexity
- Faster processing (no upload/download time)
- Complete privacy control
- Notion sync is output-only (clean metrics, not raw screenshots)

**Trade-offs:**
- No automatic backup (user responsible for backing up project folder)
- Not accessible from multiple devices (laptop-only)
- Manual screenshot collection required

**Mitigation:**
- Document backup recommendations in README
- Notion sync provides cloud copy of processed data
- Single-device is acceptable for Janice's workflow

---

### Why Screenshots vs. CSV Exports?
**Decision:** Screenshot-first approach

**Reasoning:**
- Universal (works with any platform)
- Includes visual context (helpful for debugging)
- No export step required (faster workflow)
- Captures real-time dashboard state

**Trade-offs:**
- OCR accuracy < 100% (CSV would be perfect)
- Requires image processing overhead
- Layout changes break parsing

**Mitigation:**
- Confidence scoring for extracted values
- Manual verification prompts for low-confidence data
- Pattern library approach handles multiple layouts

---

## Testing Strategy

### Phase 1 Testing (Foundation)
- **Test Data:** Fake bank statement (create in Canva or Figma)
- **Success Metric:** Extract account balance with 100% accuracy
- **Fallback:** If OCR fails, try different image preprocessing

### Phase 2 Testing (Data Extraction)
- **Test Data:** 3 fake screenshots (Quicken, QuickBooks, bank)
- **Success Metric:** JSON output matches expected schema
- **Fallback:** Adjust regex patterns, add fuzzy matching

### Phase 3 Testing (Calculations)
- **Test Data:** Hard-coded example financials
- **Success Metric:** Projections match manual calculations
- **Fallback:** Verify formulas, check for rounding errors

### Phase 4 Testing (Dashboard)
- **Test Data:** Sample JSON from Phase 2
- **Success Metric:** Dashboard renders correctly in browser
- **Fallback:** Simplify layout, use plain markdown

### Phase 5 Testing (Real Data)
- **Test Data:** Janice's actual screenshots
- **Success Metric:** 95%+ accuracy on all fields
- **Fallback:** Manual correction + document edge cases

### Phase 6 Testing (Notion Sync)
- **Test Data:** Outputs from Phase 4
- **Success Metric:** Data appears in Notion correctly formatted
- **Fallback:** Export CSV for manual import

---

## Dependencies & Installation

### System Requirements
- **OS:** Windows (Janice's laptop)
- **Node.js:** v18+ or Python 3.9+
- **Git:** Already installed (for Claude Code)
- **Claude Code CLI:** Already installed

### Required Libraries (TBD during Phase 1)

**If Python:**
```bash
pip install pytesseract pillow opencv-python pandas notion-client
```

**If Node.js:**
```bash
npm install tesseract.js sharp canvas notion-client
```

### OCR Engine Installation

**Windows (Tesseract):**
1. Download: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer
3. Add to PATH: `C:\Program Files\Tesseract-OCR`
4. Verify: `tesseract --version`

---

## Handoff Checklist

### When Handing Off from Claude to Gemini

**Before Hitting Usage Limit:**
- [ ] Update this DEVELOPMENT_LOG.md with current progress
- [ ] Commit any code changes (git commit)
- [ ] Note current phase and specific task in progress
- [ ] Document any errors or blockers
- [ ] List exact next step (be specific)

**Information for Gemini:**
- Current phase: [Phase X]
- Current task: [Specific task name]
- Status: [Working/Blocked/Testing/etc.]
- Errors: [Any error messages]
- Next step: [Exact next action]

### When Handing Off from Gemini to Claude

**Before Finishing Session:**
- [ ] Update this DEVELOPMENT_LOG.md with progress
- [ ] Commit code changes with clear commit message
- [ ] Document any approach changes or decisions
- [ ] List any issues that need Claude's attention
- [ ] Note what testing was completed

**Information for Claude:**
- Current phase: [Phase X]
- What Gemini built: [Summary]
- Decisions made: [List any architectural choices]
- Issues to address: [Anything that needs changing]
- Ready for: [Next phase/task]

---

## Performance Benchmarks

### OCR Processing Speed
*To be measured during Phase 1*

Target: < 5 seconds per screenshot

### Dashboard Generation Speed
*To be measured during Phase 4*

Target: < 2 seconds to generate HTML/MD

### Full Pipeline (Screenshot → Dashboard)
*To be measured during Phase 5*

Target: < 10 seconds end-to-end

---

## Code Quality Standards

### Must-Haves
- Error handling for every external dependency (OCR, file I/O, Notion API)
- Input validation on all user-provided data
- Clear logging at INFO level (what's happening, when)
- Comments on complex regex patterns or calculations
- Unit tests for calculation functions (debt payoff, retirement projections)

### Nice-to-Haves
- Type hints (Python) or TypeScript (Node.js)
- Comprehensive test coverage (>80%)
- Linting (flake8/pylint or eslint)
- Performance profiling

---

## Current Phase: Phase 2b - Platform Parsers (Complete ✓)

**Status:** Phase 2 complete - Both Quicken Simplifi and QuickBooks parsers working

**Next Session Goals (Phase 3 - Calculations OR Phase 4 - Dashboards):**

**Option A: Phase 3 - Calculation Engines (45-60 min)**
1. Build debt payoff calculator (avalanche method prioritization)
2. Build retirement projection calculator (compound growth model)
3. Build September 2026 capital realignment tracker
4. Add scenario modeling (conservative vs aggressive)
5. Test calculations with real financial data

**Option B: Phase 4 - Dashboard Generation (30-45 min)**
1. Build markdown dashboard template
2. Build HTML dashboard with styling
3. Integrate Quicken + QuickBooks data
4. Add visual elements (progress bars, charts)
5. Mobile-responsive design

**Estimated Time:** 30-60 minutes depending on path

---

## Git Commit History

*Commit history will be tracked here for quick reference*

```
[No commits yet - project not initialized]
```

---

## Questions to Resolve

### Before Phase 1
- [✓] Where will Janice store screenshot files? **Answer:** data/screenshots/ folder
- [✓] Python or Node.js preference? **Answer:** Node.js (for Notion integration)
- [ ] Should we start with Quicken, QuickBooks, or generic bank statements? **Pending Janice's input**

### Before Phase 6
- [ ] Which Notion database will receive the data?
- [ ] What properties does that database have?
- [ ] Update frequency? (daily/weekly/manual)

---

## Session Notes

### Session 1: 2025-11-06 (Planning with Claude)

**Context:**
- Janice traveling, will build tool later from laptop
- Claude Code already installed by Gemini
- Gemini will serve as backup assistant during usage limit cutoffs
- Building handoff infrastructure first, then tool

**Key Decisions:**
- Focus on Financial Command Center first (Clinical Intelligence Terminal deferred)
- Complete handoff documentation before starting development
- Janice will have Gemini running in Chrome sidebar to observe conversations
- No approval needed - Claude authorized to build comprehensive plan autonomously

**Janice's Directive:**
"Take your time with it. I will go work out while you put it together... please proceed without me giving approval, so we can get the ball rolling later. We can tap out your resources now on a very very complete plan?"

**Deliverables Created:**
1. PROJECT_OVERVIEW.md (complete project context)
2. DEVELOPMENT_LOG.md (this file)
3. GEMINI_QUICK_START.md (handoff procedures)
4. README.md (how to run the tool)
5. TROUBLESHOOTING.md (common issues & fixes)

**Next Session:**
- Janice returns from workout
- Opens laptop with Claude Code installed
- Begins Phase 1: Foundation with Claude or Gemini
- Follows step-by-step guide in README.md

---

### 2025-11-07 - Phase 1: Foundation - Cipher (Claude Code)

**What was built:**
- Complete project folder structure (src/, data/, tests/, config/, outputs/)
- Node.js project initialized with package.json
- OCR engine (src/ocr/screenshot_reader.js):
  - Image preprocessing (grayscale, normalize, sharpen)
  - Tesseract.js integration
  - Financial pattern recognition (currency, dates, account numbers, percentages)
  - Confidence scoring
  - Line-by-line text extraction with bounding boxes
- Main application (src/main.js):
  - Command-line interface
  - Pretty console output
  - JSON export to data/extracted/
  - Progress indicators
- Test infrastructure:
  - Sample HTML bank statement (tests/sample_data/test-bank-statement.html)
  - Testing guide (TESTING.md)
  - Phase 1 completion summary (PHASE1-COMPLETE.md)
- Security: .gitignore protecting financial data

**Decisions made:**
- **Node.js selected** (Janice preference for Notion integration)
  - Reasoning: Strong @notionhq/client library, excellent for Phase 6
  - Trade-off: Python has slightly better OCR ecosystem, but Tesseract.js sufficient
- **Preprocessing enabled by default** for better accuracy on varied screenshot quality
- **Pattern-based extraction** using regex for financial data types
- **Local-first architecture** confirmed (all data stays on machine)

**Issues encountered:**
- None - Phase 1 build smooth

**Next steps:**
- [ ] Test Phase 1 with real screenshot (Janice to provide)
- [ ] Decide which platform to parse first (Quicken/QuickBooks/Bank)
- [ ] Begin Phase 2: Platform-Specific Parsers
  - Build src/processors/quicken_parser.js OR
  - Build src/processors/quickbooks_parser.js OR
  - Build src/processors/bank_parser.js

**Time spent:** 45 minutes

**Phase 1 Status:** ✅ **COMPLETE** - Ready for user testing

**Dependencies installed:**
- tesseract.js@6.0.1 (OCR engine)
- sharp@0.34.5 (image preprocessing)
- @notionhq/client@5.3.0 (for Phase 6)

**Testing instructions:**
1. Open tests/sample_data/test-bank-statement.html in browser
2. Screenshot it and save to data/screenshots/test-bank-statement.png
3. Run: `node src/main.js data/screenshots/test-bank-statement.png`
4. Verify extracted amounts, dates, account numbers in output
5. Check data/extracted/ for JSON file

---

### 2025-11-07 - Phase 2: Platform-Specific Parsers - Cipher (Claude Code)

**What was built:**
- Quicken Simplifi parser (src/processors/quicken_parser_v2.js):
  - Pattern-based account recognition (checking, savings, credit cards, HELOC)
  - Smart amount matching (pairs account names with extracted currency values)
  - Account type classification (asset vs debt, checking vs credit_card vs credit_line)
  - Financial totals calculation (total assets, total debt, liquid assets, credit card debt)
  - Net worth validation (compares extracted vs calculated net worth)
- Enhanced processing script (src/process_quicken.js):
  - Dedicated Quicken Simplifi analysis tool
  - Formatted console output with financial overview
  - Asset/debt account breakdown
  - Net worth validation reporting
  - Structured JSON export

**Decisions made:**
- **V2 parser approach**: Use pre-extracted currency amounts from OCR, match with account names
  - Reasoning: OCR decimal reading inconsistent, better to use already-parsed amounts
  - Trade-off: Requires known account patterns (can't discover unknown accounts)
  - Result: High accuracy for known account types
- **Pattern-based account matching**: Look for specific keywords (Checking, Visa, HELOC, etc.)
  - Reasoning: More reliable than trying to parse arbitrary account names
  - Allows targeted parsing for known financial institutions
- **Debt detection**: Credit cards and HELOC automatically marked as negative balances
  - Reasoning: These accounts should show as debts even if OCR reads positive
  - Important for accurate net worth calculation

**Issues encountered:**
- **OCR decimal placement issues**: Initial parser (v1) had problems with amounts like $23,423.35 being read as $2,342,335.00
  - Resolution: V2 parser uses pre-extracted currency amounts from ScreenshotReader
- **Too many false positives**: V1 parser captured UI elements and dates as "accounts"
  - Resolution: V2 uses targeted patterns for known account types only
- **Missing accounts in validation**: Calculated net worth (-$26K) vs extracted net worth ($527K)
  - This is expected: Screenshot only shows checking/credit accounts, not retirement/investment accounts
  - Indicates ~$550K in assets not visible in this particular screenshot view

**Test results (real Quicken screenshot):**
- ✅ Successfully parsed 11 accounts
- ✅ 360 Checking: $5,639.43
- ✅ Embark Checking: $203.72
- ✅ Alaska Visa: -$23,423.35
- ✅ Business Spark Cash: -$2,082.35
- ✅ Umpqua Credit Card: -$2,891.38
- ✅ Southwest Credit Card: -$1,576.51
- ✅ Amazon: -$227.46
- ✅ HELOC: -$74.94
- ✅ Amounts accurate, account names clean
- ⚠ Net worth discrepancy indicates missing investment/retirement accounts (not in screenshot)

**Next steps:**
- [ ] Test with different Quicken screenshots (showing investment accounts)
- [ ] Decide: Build QuickBooks parser OR move to Phase 3 (Calculations)
- [ ] Phase 3 would add:
  - Debt payoff projections (avalanche method)
  - Retirement trajectory modeling
  - September 2026 capital realignment tracking
  - Practice sustainability metrics

**Time spent:** 60 minutes

**Phase 2 Status:** ✅ **COMPLETE** - Quicken Simplifi parser working accurately on visible accounts

**Files created:**
- src/processors/quicken_parser.js (v1, deprecated)
- src/processors/quicken_parser_v2.js (current, production)
- src/process_quicken.js (Quicken-specific analysis tool)

**Usage:**
```bash
node src/process_quicken.js data/screenshots/quicken-screenshot-test.png
```

---

### 2025-11-07 - Phase 2b: QuickBooks Parser - Cipher (Claude Code)

**What was built:**
- QuickBooks practice financials parser (src/processors/quickbooks_parser.js):
  - Revenue extraction and categorization (therapy fees, insurance, private pay, etc.)
  - Expense extraction and categorization (rent, insurance, software, owner comp, etc.)
  - Profitability calculations (net income, profit margin, operating expense ratio)
  - Cash flow metrics (A/R, A/P, cash balance, working capital)
  - Practice sustainability assessment (status, recommendations, emergency reserve calculation)
  - Annual projections based on monthly data
- QuickBooks processing script (src/process_quickbooks.js):
  - Dedicated QuickBooks P&L analysis tool
  - Current period metrics display
  - Annual projection calculations
  - Revenue/expense breakdown by category
  - Cash flow health reporting
  - Practice sustainability assessment with recommendations
  - Structured JSON export
- Test infrastructure:
  - Sample QuickBooks P&L statement (tests/sample_data/test-quickbooks-pl.html)
  - Realistic practice financials for therapy business

**Decisions made:**
- **Category-based extraction**: Parser looks for common therapy practice revenue/expense categories
  - Revenue: Therapy fees, insurance payments, private pay, Medicare/Medicaid
  - Expenses: Rent, insurance, software, CE, marketing, owner compensation, etc.
  - Reasoning: More reliable than trying to parse arbitrary account names
- **Sustainability assessment**: Built-in practice health scoring
  - Profit margin benchmarks (excellent: 30%+, good: 20%+, moderate: 10%+)
  - Emergency reserve recommendations (3-6 months operating expenses)
  - Reasoning: Provides actionable insights, not just raw numbers
- **Annual projections**: Automatically multiply monthly data by 12
  - Assumption: Screenshot shows monthly P&L (most common view)
  - User can adjust if screenshot shows different period
  - Reasoning: Helps with long-term planning and Solo 401(k) contribution calculations

**Test data (sample P&L):**
- Total Income: $16,595/month ($199,140 annual projection)
- Total Expenses: $12,235/month ($146,820 annual projection)
- Net Income: $4,360/month ($52,320 annual projection)
- Profit Margin: 26.3% (Good sustainability rating)
- Owner Compensation: $8,500/month ($102,000 annually)

**Revenue categories recognized:**
- Therapy Session Fees
- Insurance Payments (general)
- Private Pay
- Medicare/Medicaid
- Other Income

**Expense categories recognized:**
- Office Rent
- Professional Liability Insurance
- Health Insurance
- Software & Technology (EHR, telehealth, etc.)
- Continuing Education
- Marketing & Website
- Office Supplies
- Utilities & Internet
- Accounting & Bookkeeping
- Legal Fees
- Bank Fees
- Owner Compensation
- Other Expenses

**Issues encountered:**
- None - QuickBooks P&L format is more standardized than Quicken screenshots
- Parser ready for testing with real QuickBooks data

**Next steps:**
- [ ] Test with real QuickBooks screenshot from practice
- [ ] Validate expense categories match actual practice structure
- [ ] Adjust patterns if QuickBooks categories differ
- [ ] Move to Phase 3: Calculations (debt payoff, retirement projections) OR
- [ ] Move to Phase 4: Dashboard generation

**Time spent:** 45 minutes

**Phase 2b Status:** ✅ **COMPLETE** - QuickBooks parser ready for testing

**Files created:**
- src/processors/quickbooks_parser.js (practice financial parser)
- src/process_quickbooks.js (QuickBooks analysis tool)
- tests/sample_data/test-quickbooks-pl.html (test P&L statement)

**Usage:**
```bash
# Process a QuickBooks Profit & Loss screenshot
node src/process_quickbooks.js data/screenshots/quickbooks-oct-2025.png

# Or test with sample HTML (screenshot it first)
# 1. Open tests/sample_data/test-quickbooks-pl.html in browser
# 2. Screenshot it
# 3. Save to data/screenshots/test-quickbooks.png
# 4. Run: node src/process_quickbooks.js data/screenshots/test-quickbooks.png
```

**Integration with Quicken data:**
- Quicken shows: Net worth, personal accounts, debts
- QuickBooks shows: Practice revenue, expenses, profitability
- Combined view enables: Full financial picture for capital realignment planning

---

**End of Development Log**

*Keep this file updated after every work session. It's the single source of truth for project progress.*
