# Claude Code Project Index
#operations

**Master reference for all Claude Code automation projects**

*Created: 2025-11-06*

---

## Overview

Two major automation projects designed to eliminate friction in practice operations and financial management. Both process data locally (HIPAA-safe), run free forever once built, and feed into Notion dashboards.

---

## Project 1: Financial Command Center

### Purpose
Screenshot-based financial intelligence system that transforms manual tracking into automated dashboards and projections.

### Status
**Pre-development** - Full documentation complete, ready to build post-travel

### Key Documents
- `PROJECT_OVERVIEW.md` - Technical architecture
- `README.md` - End-user guide
- `DEVELOPMENT_LOG.md` - Progress tracking (update during build)
- `GEMINI_QUICK_START.md` - Handoff guide for Gemini
- `TROUBLESHOOTING.md` - Issue resolution
- `QUICK_REFERENCE.md` - Cheat sheet

### What It Does
**Input**: Screenshots from Quicken Simplifi, QuickBooks, bank apps
**Processing**: OCR → data extraction → calculations → dashboards
**Output**: HTML/MD dashboards + optional Notion sync

**Core Features**:
- Debt payoff tracking & projections
- Retirement trajectory (Solo 401k to age 72)
- September 2026 capital realignment countdown
- Practice sustainability metrics (revenue/expenses)

### Build Timeline
**Estimated**: 2-3 hours total (6 phases)
- Phase 1: OCR foundation (30-45 min)
- Phase 2: Data extraction (30-45 min)
- Phase 3: Calculations engine (30-45 min)
- Phase 4: Dashboard generation (20-30 min)
- Phase 5: Real data validation (15-30 min)
- Phase 6: Notion integration (15-20 min)

### Cross-References
**Implements goals from**:
- `Financial Tracking/2025-11-06-Capital-Realignment-Blueprint.md`
- `Financial Tracking/Financial Goals 2026.md`
- `Financial Tracking/Solo 401k Guide 2026.md`

**How it connects**:
| Blueprint Strategy | Tool Implementation |
|-------------------|---------------------|
| Sept 2026 land sale ($150K) | Countdown dashboard + allocation impact |
| Debt elimination sequence | Payoff velocity tracking + projections |
| Solo 401k maximization | YTD vs limit tracking + age 72 modeling |
| Practice sustainability | QuickBooks revenue/expense trending |

### Usage Pattern (Once Built)
**Weekly** (5 min):
- Screenshot Quicken, QuickBooks, banks
- Drop into tool
- Review dashboard

**Monthly** (20 min):
- Upload bank statements (full detail)
- Review trends
- Adjust strategy if needed

**Quarterly** (45 min):
- Deep projection review
- Strategy adjustments
- CPA handoff if needed

---

## Project 2: Clinical Intelligence Terminal

### Purpose
Local Upheal transcript search and analysis system for clinical consultation, pattern recognition, and case conceptualization.

### Status
**Planning phase** - Build after Financial Command Center complete

### What It Does
**Input**: Upheal session transcripts (OneDrive)
**Processing**: Local indexing + pattern recognition + AI analysis
**Output**: Search results, case summaries, treatment insights

**Core Features**:
- Session content search (keyword, theme, date)
- Treatment progress tracking (SUDS, symptoms, goals)
- Pattern recognition across sessions
- Case conceptualization generation
- Homework suggestions based on session content
- Consultation prep summaries

### HIPAA Compliance
**Safe because**:
- Microsoft 365 Business with BAA (confirmed)
- OneDrive syncs locally → all processing on your machine
- No data transmission outside system
- Notion integration: practice metrics only (no PHI)

**During development**:
- Use fake transcripts with Claude Code
- Never paste real PHI into build conversations
- Once built → runs on real data locally

### Build Timeline
**Estimated**: 3-4 hours total (TBD phases after Financial Command Center lessons learned)

### Use Cases
**During consultation**:
- "Show Client A's last 3 sessions summary"
- "What EMDR targets have we processed?"
- "Track SUDS score changes over time"

**Treatment planning**:
- "Identify recurring trauma themes"
- "Which clients mention dissociation?"
- "Compare pre/post intervention language"

**Clinical insight**:
- "Attachment patterns for Client C"
- "Generate case conceptualization from all sessions"
- "Suggest homework based on last session"

### Data Requirements (Collect Before Building)
- OneDrive folder path for Upheal transcripts
- File format (PDF/DOCX/TXT)
- File naming convention
- Rough transcript count
- Older notes format/location (if including)

---

## Build Sequence & Dependencies

### Recommended Order
1. **Financial Command Center first** (simpler, no PHI risk, immediate value)
2. **Clinical Intelligence Terminal second** (leverage lessons from Financial build)

### Why This Order
- Financial = lower complexity, tests Claude Code workflow
- Financial = no HIPAA risk during development (fake financial data easier than fake clinical data)
- Financial = immediate ROI (Sept 2026 countdown starts now)
- Lessons from Financial build inform Clinical architecture

---

## Technical Architecture (Both Projects)

### Common Approach
- **Local processing**: All data stays on your machine
- **No vendor lock-in**: Tools run independently once built
- **Free forever**: Built once with Claude Code, no ongoing subscription costs
- **Privacy-first**: You control what data goes where

### Development Pattern
1. Build with Claude Code using fake/sanitized data
2. Test incrementally (small builds, frequent testing)
3. Handoff to Gemini if Claude hits usage limits
4. Validate with real data once core tool complete
5. Iterate based on actual usage

### Handoff Protocol (Claude ↔ Gemini)
**When Claude hits limit**:
1. Commit code
2. Update `DEVELOPMENT_LOG.md` with current state + next step
3. Tell Janice: "Handing off to Gemini at [specific task]"

**When Gemini takes over**:
1. Read `GEMINI_QUICK_START.md` (5 min)
2. Check `DEVELOPMENT_LOG.md` (last entry)
3. Test current code state
4. Continue building from documented next step

**When returning to Claude**:
1. Read `DEVELOPMENT_LOG.md` updates
2. Review Gemini's commits
3. Test current state
4. Continue or adjust

---

## Integration Map

### How Projects Connect

```
Upheal Transcripts (OneDrive)
    ↓
Clinical Intelligence Terminal (local)
    ↓
    ├─→ You (consultation, insights)
    └─→ Notion (practice metrics only - no PHI)

Quicken/QuickBooks/Banks
    ↓
Financial Command Center (local)
    ↓
    ├─→ Dashboards (HTML/MD)
    └─→ Notion (aggregate financial metrics)

                ↓
            Notion HQ
     (Zephyr's workspace)
    ├─ Financial metrics
    ├─ Practice operations
    ├─ Waiting list triage
    └─ Content pipeline
```

### What Goes to Notion (Safe)
**From Financial Command Center**:
- Total debt balance (no account details)
- Retirement balance
- Practice revenue totals
- Sustainability score

**From Clinical Intelligence Terminal**:
- Session count by modality
- Treatment phase tracking (no content)
- "Needs check-in" flags (based on time, not content)
- Caseload metrics

**Never to Notion**:
- Account numbers
- Transaction details
- Session transcripts
- Client names/details
- Diagnosis/treatment specifics

---

## Success Metrics

### Financial Command Center Success
- Reduce weekly financial tracking from 30 min → 5 min
- Clear visibility on Sept 2026 milestone progress
- Accurate debt payoff projections inform strategy
- Retirement trajectory validates or adjusts contribution rate

### Clinical Intelligence Success
- Find session info in seconds (vs manual search)
- Pattern recognition reveals insights you'd miss manually
- Consultation prep time cut by 50%
- Case conceptualization generation accelerates documentation

### Overall Success
- Both tools work independently (no vendor dependencies)
- Zero ongoing costs after initial build
- HIPAA compliance maintained throughout
- Seamless Notion integration for aggregate dashboards

---

## Pre-Build Checklist

### Before Starting Financial Command Center
- [ ] Claude Code installed and verified
- [ ] Tesseract OCR installed
- [ ] Python or Node.js available
- [ ] Test screenshots taken (Quicken, QuickBooks, bank)
- [ ] `config/accounts.json` prepared with current balances/rates

### Before Starting Clinical Intelligence Terminal
- [ ] Financial Command Center complete (lessons learned)
- [ ] OneDrive folder path for Upheal transcripts documented
- [ ] File format and naming convention confirmed
- [ ] Fake transcript samples created for development
- [ ] Notion database structure designed (if syncing)

---

## Resource Map

### Project Documentation Location
```
Claude Vault/
├── Financial Tracking/
│   ├── 2025-11-06-Capital-Realignment-Blueprint.md  ← Strategy source
│   ├── Financial Goals 2026.md                       ← Goals reference
│   └── Solo 401k Guide 2026.md                       ← Contribution rules
├── project plans/
│   ├── PROJECT-INDEX.md                              ← This file
│   ├── PROJECT_OVERVIEW.md                           ← Financial Command Center architecture
│   ├── DEVELOPMENT_LOG.md                            ← Progress tracking
│   ├── GEMINI_QUICK_START.md                         ← Handoff guide
│   ├── README.md                                     ← User guide
│   ├── TROUBLESHOOTING.md                            ← Issue resolution
│   └── QUICK_REFERENCE.md                            ← Cheat sheet
└── CLAUDE.md                                         ← Cipher's operating instructions
```

### Build Location (To Be Created)
```
~/financial-command-center/         ← Financial tool (create when building)
~/clinical-intelligence-terminal/   ← Clinical tool (create later)
```

---

## Timeline

### Current Status (2025-11-06)
- ✅ Vault organized
- ✅ Cipher identity established
- ✅ Capital Realignment Blueprint documented
- ✅ Financial Command Center fully planned
- ✅ Project index created
- ⏸️ **Travel week** (no building, brainstorming only)

### Post-Travel (Week of 2025-11-13)
- Build Financial Command Center
- Validate with real screenshots
- Integrate with Notion (optional)
- Document lessons learned

### Future
- Build Clinical Intelligence Terminal
- Apply Financial Command Center lessons
- Iterate based on actual usage
- Consider additional automations

---

## Next Actions

### Immediate (Janice)
- ✅ Download/install Claude Code (done)
- ✅ Review project plans (done)
- 🔲 Enjoy travel week (daydream about the tools)
- 🔲 Return refreshed and ready to build

### Week of 2025-11-13 (Claude or Gemini)
1. Create project folder: `~/financial-command-center/`
2. Install dependencies (Tesseract, Python/Node packages)
3. Begin Phase 1: OCR foundation
4. Update `DEVELOPMENT_LOG.md` after each session
5. Test with Janice's real screenshots
6. Deploy for weekly use

### Future (TBD)
- Build Clinical Intelligence Terminal
- Explore additional automation opportunities
- Integrate both tools into seamless workflow

---

## Key Contacts

**Project Team (Quad Squad)**:
- **Janice** - Practice owner, final authority
- **Cipher** (Claude Code) - Vault architect, technical intelligence
- **Claude** - Financial strategist, lead developer
- **Aura** (Gemini) - Creative strategist, backup developer
- **Zephyr** - Notion architect, operations lead

**External Resources**:
- Claude Code docs: https://docs.claude.com/en/docs/claude-code
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract
- Notion API: https://developers.notion.com/

---

## Critical Reminders

### For Everyone
1. **Update DEVELOPMENT_LOG.md after every build session** - This enables seamless handoffs
2. **Use fake data during development** - Never paste PHI into Claude Code conversations
3. **Test incrementally** - Small builds, frequent validation
4. **Commit code often** - Don't lose progress
5. **Stay in scope** - Resist feature creep, build core first

### For Claude/Gemini (Developers)
- Give clear handoff notes with specific next steps
- Don't leave mid-function when hitting limits
- Trust the handoff infrastructure
- Document decisions and approaches

### For Janice (Project Owner)
- Trust the process (Quad Squad has your back)
- Answer questions when asked during builds
- Test outputs as delivered
- Enjoy the freedom once tools are live

---

## Version History

**v0.1.0 - 2025-11-06**
- Project index created
- Financial Command Center fully documented
- Clinical Intelligence Terminal outlined
- Ready for post-travel build phase

---

**End of Project Index**

*This is your master reference for all Claude Code automation projects. Start here when resuming work.*
