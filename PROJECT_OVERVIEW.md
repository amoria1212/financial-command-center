# Financial Command Center - Project Overview

## Project Purpose
A local tool that processes financial data through screenshots to create actionable dashboards and projections for Janice LaFountaine's solo therapy practice and personal financial management.

## Core Problem Being Solved
- Manual tracking of debt payoff progress across multiple accounts
- No unified view of retirement savings trajectory
- Difficulty visualizing September 2026 capital realignment milestone
- Time-consuming financial data aggregation from multiple platforms

## Why Screenshots Instead of APIs
- **Vendor independence**: No reliance on third-party API changes or deprecations
- **Universal compatibility**: Works with any financial platform that has a screen
- **Privacy**: No account credentials or API keys stored
- **Simplicity**: Same method works for QuickBooks, Quicken Simplifi, bank sites, credit cards

## Technical Approach
1. **Input**: Screenshots of financial dashboards (PNG/JPG)
2. **Processing**: OCR extraction via Tesseract or similar
3. **Data Structure**: JSON intermediate format
4. **Output**: Markdown/HTML dashboards + optional Notion database feed
5. **Storage**: All processing happens locally on user's machine

## HIPAA Compliance Considerations
- This tool processes FINANCIAL data only (no PHI)
- Practice income/expenses are business data, not protected health information
- Safe to store outputs in Notion (no BAA required for non-PHI)
- Client names/details never touch this system

## Key Financial Context

### Janice's Financial Profile (Age 57)
- **Target Retirement**: Age 72-75
- **Current Focus**: Aggressive wealth-building phase
- **Major Milestone**: September 2026 capital realignment ($150k land sale proceeds)

### Primary Financial Goals
1. **Maximize Solo 401(k)** contributions annually
2. **Strategic debt payoff** sequencing (high-interest first)
3. **September 2026 capital realignment** tracking
4. **Practice sustainability** metrics

### Accounts to Track
- **Practice Revenue**: QuickBooks tracking
- **Personal Finance**: Quicken Simplifi dashboard
- **Banking**: Multiple checking/savings accounts
- **Debt**: Credit cards, loans (prioritized by interest rate)
- **Retirement**: Solo 401(k) contributions and growth

### Key Metrics to Display
1. **Debt Payoff Progress**
   - Current balance by account
   - Interest rates
   - Minimum payments vs. actual payments
   - Projected payoff dates at current rate
   - Accelerated payoff scenarios

2. **Retirement Trajectory**
   - Current Solo 401(k) balance
   - YTD contributions
   - Remaining contribution room
   - Projected balance at age 72, 73, 74, 75
   - Required monthly contributions to hit targets

3. **September 2026 Capital Realignment**
   - Days until milestone
   - Land sale allocation plan ($150k)
   - Target debt elimination before realignment
   - Post-realignment financial position projection

4. **Practice Sustainability**
   - Monthly revenue trends
   - Operating expenses
   - Owner's compensation
   - Net practice income

## Tech Stack

### Development Environment
- **Tool**: Claude Code CLI (installed via npm)
- **Language**: Python or Node.js (developer's choice based on OCR library)
- **Version Control**: Git (installed as dependency)
- **Platform**: Windows (laptop environment)

### Core Libraries Needed
- **OCR Engine**: Tesseract, pytesseract, or node-tesseract-ocr
- **Image Processing**: PIL/Pillow (Python) or Sharp (Node)
- **Data Parsing**: Regex patterns for currency/dates/account numbers
- **Output Generation**: Markdown templating or HTML generation
- **Optional Notion API**: @notionhq/client (Node) or notion-client (Python)

### File Structure
```
~/financial-command-center/
├── HANDOFF.md                  # This file - Gemini quick reference
├── PROJECT_OVERVIEW.md         # Full context document
├── DEVELOPMENT_LOG.md          # Progress tracking
├── README.md                   # How to run the tool
├── src/
│   ├── ocr/
│   │   ├── screenshot_reader.js/py
│   │   └── data_extractor.js/py
│   ├── processors/
│   │   ├── quicken_parser.js/py
│   │   ├── quickbooks_parser.js/py
│   │   └── bank_statement_parser.js/py
│   ├── calculators/
│   │   ├── debt_payoff.js/py
│   │   ├── retirement_projections.js/py
│   │   └── capital_realignment.js/py
│   └── outputs/
│       ├── dashboard_generator.js/py
│       └── notion_sync.js/py (optional)
├── data/
│   ├── screenshots/            # Input images
│   ├── extracted/              # Intermediate JSON
│   └── archives/               # Historical data
├── outputs/
│   ├── dashboards/             # Generated HTML/MD files
│   └── exports/                # Notion-ready data
├── config/
│   ├── accounts.json           # Account metadata (names, types, interest rates)
│   └── goals.json              # Financial targets and milestones
└── tests/
    ├── sample_data/            # Fake screenshots for development
    └── test_cases/             # Unit tests

```

## Development Phases

### Phase 1: Foundation (30-45 min)
**Goal**: Basic screenshot → text extraction working

**Tasks**:
- Set up project structure
- Install OCR dependencies
- Create screenshot reader function
- Test with one fake bank statement screenshot
- Verify text extraction quality

**Success Criteria**:
- Can read a screenshot
- Can extract currency amounts accurately
- Can identify account names/numbers

### Phase 2: Data Extraction (30-45 min)
**Goal**: Parse extracted text into structured data

**Tasks**:
- Build regex patterns for common financial data formats
- Create JSON schema for extracted data
- Build parser for Quicken Simplifi format
- Build parser for QuickBooks format
- Build parser for generic bank statement format

**Success Criteria**:
- Screenshots → clean JSON output
- All key fields captured (balances, dates, account info)
- Error handling for unclear/corrupted text

### Phase 3: Calculations Engine (30-45 min)
**Goal**: Transform raw data into insights

**Tasks**:
- Debt payoff calculator (current rate vs. accelerated)
- Retirement projection calculator (compound growth + contributions)
- September 2026 countdown and allocation tracker
- Practice sustainability metrics

**Success Criteria**:
- Accurate projections based on extracted data
- Multiple scenario modeling (conservative/aggressive)
- Clear milestone tracking

### Phase 4: Dashboard Generation (20-30 min)
**Goal**: Beautiful, actionable output

**Tasks**:
- Create markdown template for financial dashboard
- Add charts/graphs (optional - can use ASCII art or link to external viz)
- Generate HTML version with styling
- Add export functionality

**Success Criteria**:
- One-command dashboard generation
- Mobile-friendly display
- Clear action items highlighted

### Phase 5: Real Data Testing (15-30 min)
**Goal**: Validate with Janice's actual screenshots

**Tasks**:
- Process real Quicken Simplifi screenshots
- Process real QuickBooks screenshots
- Process real bank statements
- Debug format variations
- Calibrate OCR for actual data quality

**Success Criteria**:
- 95%+ accuracy on real data
- Handles Janice's specific account formats
- Produces actionable insights

### Phase 6: Notion Integration (Optional, 15-20 min)
**Goal**: Feed clean data to Zephyr's Notion workspace

**Tasks**:
- Map outputs to Notion database schema
- Create sync script
- Test data flow
- Set up automation schedule (optional)

**Success Criteria**:
- Data appears correctly in Notion
- No manual copy/paste needed
- Zephyr can build views on top of this data

## Known Challenges & Solutions

### Challenge 1: OCR Accuracy
**Problem**: Financial screenshots may have varying quality, fonts, backgrounds

**Solutions**:
- Pre-process images (contrast enhancement, noise reduction)
- Use multiple OCR passes with different settings
- Build confidence scoring for extracted values
- Manual verification prompt for low-confidence extractions

### Challenge 2: Format Variations
**Problem**: Banks/platforms change layouts, use different date formats, etc.

**Solutions**:
- Pattern library approach (multiple regex patterns per field)
- Fuzzy matching for account names
- User-configurable mappings in accounts.json
- Graceful degradation (extract what we can, flag the rest)

### Challenge 3: Data Freshness
**Problem**: Screenshots are point-in-time, not live data

**Solutions**:
- Timestamp every extraction
- Track deltas between runs
- Prompt user for new screenshots when data is stale (>7 days)
- Store historical snapshots for trend analysis

### Challenge 4: Security
**Problem**: Screenshots contain sensitive financial information

**Solutions**:
- All processing happens locally (no cloud uploads)
- Option to blur/redact account numbers in outputs
- .gitignore for data/ folder (never commit screenshots)
- Clear documentation on data handling

## Success Metrics

### Development Success
- Build completes in < 3 hours total
- All core features functional on first real data test
- Handoff to Gemini works smoothly if Claude hits limits

### Usage Success (After Deployment)
- Janice runs it weekly in < 5 minutes
- Outputs are immediately actionable (no interpretation needed)
- Reduces financial tracking time from 30 min/week to 5 min/week
- Accurate projections inform strategic decisions

### Integration Success
- Clean data flows to Notion without manual intervention
- Zephyr can build views on top of outputs
- Works alongside Clinical Intelligence Terminal (parallel project)

## Handoff Instructions for Gemini

### If Picking Up Mid-Build

**Step 1: Get Context**
- Ask Janice: "Where did you and Claude leave off?"
- Look for DEVELOPMENT_LOG.md in project folder
- Check what files exist in src/ folder

**Step 2: Assess Current State**
- Run any existing code to see what works
- Check tests/ folder for passing/failing tests
- Identify the next incomplete phase

**Step 3: Continue Building**
- Follow phase plan from PROJECT_OVERVIEW.md
- Update DEVELOPMENT_LOG.md as you go
- Test incrementally (don't build too much before testing)

**Step 4: Document for Claude's Return**
- Update DEVELOPMENT_LOG.md with what you built
- Note any decisions made or approaches changed
- Flag any issues that need Claude's input

### Key Questions to Ask Janice

If anything is unclear:
1. "Which financial platform should I focus on first?" (Prioritize one)
2. "Do you have sample screenshots I can test with?" (Real or fake)
3. "What's the most important metric you need to see?" (Focus there first)
4. "Should I build the Notion integration now or later?" (Defer if time-tight)

### What NOT to Do

- **Don't change project architecture** without discussing (stick to the plan)
- **Don't add features** not in the original scope (avoid scope creep)
- **Don't skip error handling** (financial data must be accurate)
- **Don't commit sensitive data** (keep screenshots local only)

## Communication Style with Janice

### What She Values
- **Direct**: Lead with the answer, no preamble
- **Actionable**: Concrete next steps, not theory
- **Efficient**: No ceremony, no "let me know if you need anything else"
- **Warm**: Be personable and fun, like a brilliant co-conspirator

### What to Avoid
- Long summaries for simple questions
- Over-documenting simple fixes
- Multiple options when one is clearly best
- "Let me build a framework..." (just build it)
- "Would you like me to also..." (if it's obvious, just do it)

### Decision-Making
- She trusts your independent judgment
- Make bold moves, test fast
- If something doesn't work, pivot immediately
- Ask permission for big direction changes only

## Related Projects

### Clinical Intelligence Terminal
- **Parallel project** (not yet built)
- Searches Upheal session transcripts locally
- Pattern recognition across therapy sessions
- 100% local processing (HIPAA-compliant)
- Will be built AFTER Financial Command Center

### Quad Squad Context
Janice works with a team of AI assistants:
- **Zephyr** (Notion): Daily execution, workflows, PHI data
- **Aura** (Gemini): Creative synthesis, philosophy, apps
- **Claude**: Financial strategy (40%) + Operations/content (60%)

The Financial Command Center feeds Zephyr's Notion workspace but is built by Claude (with Gemini backup).

## Version Control

### Current Version: 0.1.0-planning
- Status: Pre-development
- Last Updated: 2025-11-06
- Next Milestone: 0.2.0-foundation (Phase 1 complete)

### Change Log
- 2025-11-06: Project overview created
- 2025-11-06: Handoff infrastructure designed
- [Future entries will go here]

## Resources

### Documentation
- Claude Code CLI docs: https://docs.claude.com/en/docs/claude-code
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract
- Notion API: https://developers.notion.com/

### Janice's Key Files
- Project location: `~/financial-command-center/` (will be created)
- Notion workspace: Managed by Zephyr
- Screenshots source: TBD (Janice will specify folder)

### Financial Context References
- Solo 401(k) limits: https://www.irs.gov/retirement-plans/one-participant-401k-plans
- Debt payoff strategies: Avalanche method (highest interest first)
- Retirement calculators: Standard compound interest formulas

---

**End of Project Overview**

*This document is the source of truth for the Financial Command Center project. Update it as the project evolves. Reference it whenever resuming work or handing off between assistants.*
