# Financial Command Center - Quick Reference Card

**One-Page Cheat Sheet for Fast Access**

---

## For Janice: Daily Use

### Weekly Financial Check-In (10 minutes)

```bash
# 1. Take screenshots (5 min)
#    - Quicken Simplifi dashboard
#    - QuickBooks P&L
#    - Bank accounts
#    - Credit cards
#    Save to: ~/financial-command-center/data/screenshots/

# 2. Run tool (30 sec)
cd ~/financial-command-center
python src/main.py

# 3. View dashboard (5 min)
open outputs/dashboards/financial_dashboard_[today].html

# Done!
```

### Quick Commands

```bash
# Help
python src/main.py --help

# Manual entry mode (if OCR fails)
python src/main.py --manual-entry

# Verify all amounts (double-check mode)
python src/main.py --verify-all

# Skip Notion sync
python src/main.py --no-notion

# Export to CSV
python src/main.py --export-csv
```

### Troubleshooting Fast

**OCR wrong?** → Retake screenshot (higher quality)  
**Missing data?** → Check `config/accounts.json`  
**Dashboard blank?** → Open `outputs/dashboards/*.md` instead  
**Tool won't run?** → `python src/main.py --check-system`

---

## For Gemini: Picking Up Mid-Build

### First 60 Seconds

```bash
# 1. Navigate to project
cd ~/financial-command-center

# 2. Read last entry
cat DEVELOPMENT_LOG.md | tail -n 50

# 3. Check current phase
# Look for: "Current Phase: Phase X"

# 4. Test what exists
python src/main.py  # or: node src/index.js
```

### Phase Checklist

- [ ] **Phase 1:** OCR working? (`python src/ocr/screenshot_reader.py`)
- [ ] **Phase 2:** Data extraction? (`python src/processors/quicken_parser.py`)
- [ ] **Phase 3:** Calculations? (`python src/calculators/debt_payoff.py`)
- [ ] **Phase 4:** Dashboard? (`python src/outputs/dashboard_generator.py`)
- [ ] **Phase 5:** Real data tested?
- [ ] **Phase 6:** Notion sync working?

### Continue Building

```bash
# Update log after each task
echo "### $(date +%Y-%m-%d) - Phase X - Gemini

**What was built:**
- [Task completed]

**Next:**
- [ ] [Next task]" >> DEVELOPMENT_LOG.md

# Commit often
git add .
git commit -m "Gemini: [what you built]"
```

### Key Files

- **PROJECT_OVERVIEW.md** → Full context
- **DEVELOPMENT_LOG.md** → What's been done
- **GEMINI_QUICK_START.md** → Detailed guide for you
- **README.md** → How to run
- **TROUBLESHOOTING.md** → Common issues

---

## Project Structure (at a glance)

```
~/financial-command-center/
├── src/
│   ├── ocr/           ← Screenshot reading
│   ├── processors/    ← Data extraction
│   ├── calculators/   ← Projections
│   └── outputs/       ← Dashboard generation
├── data/
│   └── screenshots/   ← Input images (Janice puts them here)
├── outputs/
│   └── dashboards/    ← Generated dashboards (Janice views these)
└── config/
    ├── accounts.json  ← Account details
    └── goals.json     ← Financial targets
```

---

## Common Errors & Instant Fixes

| Error | Fix |
|-------|-----|
| `tesseract: command not found` | Install: `brew install tesseract` (Mac) or download Windows installer |
| `ModuleNotFoundError: pytesseract` | `pip install pytesseract pillow` |
| `Cannot find module 'tesseract.js'` | `npm install tesseract.js sharp` |
| OCR returns gibberish | Retake screenshot (higher resolution, better lighting) |
| Dashboard shows $0.00 | Check `config/accounts.json` has account listed |
| Notion sync fails | Verify `.env` has correct API key and database ID |
| Tool runs slow (>30 sec) | Enable caching: `python src/main.py --use-cache` |

---

## Testing Checklist

**Before marking a phase complete:**

- [ ] Code runs without errors
- [ ] Output matches expected format
- [ ] Edge cases handled (missing data, bad images)
- [ ] Logged in DEVELOPMENT_LOG.md
- [ ] Committed to git
- [ ] Tested with real data (if Phase 5)

---

## Communication Quick Guide

### With Janice

**Do:**
- Lead with answer
- Be direct and warm
- Show results immediately

**Don't:**
- "Let me know if..."
- "I can do X or Y..." (pick best)
- Long explanations (unless asked)

### With Claude (when returning)

**Leave notes:**
- What phase completed
- What works / what doesn't
- Decisions made
- Issues to review

---

## File Locations (Where Things Go)

| What | Where |
|------|-------|
| Janice's screenshots | `data/screenshots/` |
| Generated dashboards | `outputs/dashboards/` |
| Account settings | `config/accounts.json` |
| Goals & targets | `config/goals.json` |
| API keys | `.env` (root folder) |
| Logs | `logs/` |
| Development notes | `DEVELOPMENT_LOG.md` |

---

## Notion Integration (If Syncing)

**Required Properties:**
- Date (date)
- Total Debt (number)
- Retirement Balance (number)
- Net Practice Income (number)
- On Track (checkbox)

**Setup:**
1. Create `.env` file in root
2. Add: `NOTION_API_KEY=secret_xxx`
3. Add: `NOTION_DATABASE_ID=xxx`
4. Share database with integration

**Test:**
```bash
python src/main.py --test-notion-connection
```

---

## Git Commands (Quick Reference)

```bash
# See what changed
git status

# Save changes
git add .
git commit -m "Description"

# View history
git log --oneline -n 10

# Go back to previous version
git reset --hard [commit-hash]

# Create backup branch
git branch backup_[date]
```

---

## Emergency: If Everything Breaks

```bash
# 1. Backup current state
cp -r ~/financial-command-center ~/financial-command-center_backup_$(date +%Y%m%d)

# 2. Reset to last working version
git log --oneline  # Find last good commit
git reset --hard [commit-hash]

# 3. If that doesn't work, tell Janice:
"The tool needs rebuilding from [phase]. Here's what works: [list]. 
Here's what doesn't: [list]. Recommend: [solution]."
```

---

## Success Metrics

**Development:**
- Each phase completes in ~30-45 min
- Tests pass before moving to next phase
- Real data works by Phase 5

**Daily Use:**
- Janice runs tool in < 5 min
- Dashboard loads in < 2 sec
- Accuracy > 95%

---

## Version Quick Check

**Current version:** 0.1.0 (pre-launch)  
**Last updated:** [Check DEVELOPMENT_LOG.md]  
**Current phase:** [Check DEVELOPMENT_LOG.md]

---

## Need More Help?

- **Full context:** PROJECT_OVERVIEW.md
- **Gemini guide:** GEMINI_QUICK_START.md
- **How to run:** README.md
- **Common issues:** TROUBLESHOOTING.md
- **Progress log:** DEVELOPMENT_LOG.md

---

**Print this page and keep it visible during work sessions!**

**For Janice:** Bookmark the "Daily Use" section  
**For Gemini:** Bookmark the "Picking Up Mid-Build" section  
**For Claude:** This whole page when returning
