# Gemini Quick Start Guide

## Purpose
You're Gemini, stepping in to continue building the Financial Command Center because Claude hit usage limits. This guide gets you oriented fast so you can pick up where Claude left off without missing a beat.

---

## Immediate Context

### What You're Building
A local tool that reads financial screenshots (Quicken Simplifi, QuickBooks, bank statements) and generates dashboards showing:
- Debt payoff progress
- Retirement projections
- September 2026 capital realignment tracking
- Practice sustainability metrics

### Who You're Working With
**Janice LaFountaine**
- Solo therapist with practice in WA/ID
- Age 57, targeting retirement age 72-75
- Tech-savvy, values efficiency and elegance
- Prefers direct communication, no fluff
- Trusts your independent judgment

### Why This Matters
Saves Janice ~25 min/week on financial tracking. Built once, runs forever (no ongoing Claude usage). Feeds data to Zephyr (her Notion assistant) for financial dashboards.

---

## Step 1: Get Your Bearings (First 2 Minutes)

### Ask Janice These Questions:

**1. "Where did you and Claude leave off?"**
   - Listen for: phase name, specific task, any errors

**2. "Can you show me the project folder?"**
   - Should be at `~/financial-command-center/` or similar
   - Look for existing code files

**3. "Do you have the DEVELOPMENT_LOG.md file?"**
   - Open it and read the last entry
   - Shows exactly what was built last

**4. "Are there any error messages I should know about?"**
   - Screenshot or paste them if available

---

## Step 2: Assess Current State (Next 3 Minutes)

### Check What Exists

**Navigate to project folder:**
```bash
cd ~/financial-command-center/
ls -la
```

**Look for:**
- `src/` folder → code has been written
- `tests/` folder → testing started
- `data/screenshots/` → sample data exists
- `package.json` or `requirements.txt` → dependencies installed

### Run What's There

**If Node.js project:**
```bash
node src/index.js
```

**If Python project:**
```bash
python src/main.py
```

**See what happens:**
- Works? Great, ready to add features
- Errors? Note them, we'll fix
- Nothing? Need to build from scratch

---

## Step 3: Check DEVELOPMENT_LOG.md

**Open the file:**
```bash
cat DEVELOPMENT_LOG.md
```

**Find the last entry:**
- What phase? (1-6)
- What was completed?
- What's next?
- Any blockers?

**Update your mental model:**
- Phase 1 = OCR foundation
- Phase 2 = Data extraction
- Phase 3 = Calculations
- Phase 4 = Dashboard generation
- Phase 5 = Real data testing
- Phase 6 = Notion integration

---

## Step 4: Continue Building (Your Main Work)

### General Approach

**1. Work incrementally**
   - Build one small thing
   - Test it
   - Commit it
   - Build next thing

**2. Follow the phase plan** (from PROJECT_OVERVIEW.md)
   - Don't skip steps
   - Don't add extra features
   - Stick to the scope

**3. Test constantly**
   - Every function should work before moving on
   - Use sample data first, real data later
   - If something breaks, fix it before proceeding

**4. Document as you go**
   - Update DEVELOPMENT_LOG.md after each task
   - Note any decisions you make
   - Flag issues for Claude to review

### If Starting Phase 1 (OCR Foundation)

**Create basic structure:**
```bash
mkdir -p src/ocr src/processors src/calculators src/outputs
mkdir -p data/screenshots data/extracted data/archives
mkdir -p outputs/dashboards outputs/exports
mkdir -p tests/sample_data tests/test_cases
```

**Install OCR library:**

*For Python:*
```bash
pip install pytesseract pillow
```

*For Node.js:*
```bash
npm install tesseract.js sharp
```

**Create first test screenshot:**
- Use Canva, Figma, or PowerPoint
- Make a fake bank statement: "Checking Account - Balance: $2,500.00"
- Save as PNG in `data/screenshots/test_bank.png`

**Build basic reader:**

*Python example:*
```python
from PIL import Image
import pytesseract

def read_screenshot(image_path):
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    return text

if __name__ == "__main__":
    result = read_screenshot("data/screenshots/test_bank.png")
    print(result)
```

*Node.js example:*
```javascript
const Tesseract = require('tesseract.js');

async function readScreenshot(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return text;
}

readScreenshot('data/screenshots/test_bank.png')
  .then(text => console.log(text));
```

**Test it:**
- Run the script
- Verify it prints text from the image
- Should see "Balance: $2,500.00" or similar

**Success?** Move to extracting structured data (Phase 2)

**Failed?** Debug: check Tesseract installation, image quality, file path

### If Continuing Phase 2+ (Data Extraction)

**Check PROJECT_OVERVIEW.md** for phase details

**Pattern:**
1. Read last completed task from DEVELOPMENT_LOG.md
2. Implement next task from phase checklist
3. Test it
4. Update DEVELOPMENT_LOG.md
5. Repeat

---

## Step 5: Test Your Work

### Before Calling It Done

**Run all tests:**
```bash
# Python
python -m pytest tests/

# Node.js
npm test
```

**Manual verification:**
- Does the output look right?
- Are the numbers accurate?
- Would Janice understand this without explanation?

**Error check:**
- Try bad inputs (corrupted images, missing files)
- Does it fail gracefully with clear error messages?

---

## Step 6: Update for Claude's Return

### Before You Finish

**Update DEVELOPMENT_LOG.md:**
```markdown
### [Date] - [Phase] - Gemini

**What was built:**
- [List everything you added]

**Decisions made:**
- [Any choices you made about implementation]

**Issues encountered:**
- [Problems and how you solved them]

**Next steps:**
- [ ] [What Claude should do next]

**Time spent:** [Your session duration]
```

**Commit your code:**
```bash
git add .
git commit -m "Gemini: [what you built]"
```

**Leave clear notes:**
- What works
- What doesn't
- What needs Claude's attention

---

## Common Issues & Quick Fixes

### Issue: Tesseract Not Found

**Symptom:** "tesseract: command not found" or similar

**Fix:**
```bash
# Windows (in PowerShell as admin)
choco install tesseract

# Or download from:
# https://github.com/UB-Mannheim/tesseract/wiki

# Add to PATH after install
```

### Issue: Low OCR Accuracy

**Symptom:** Wrong numbers, garbled text

**Fixes:**
1. **Preprocessing:**
   ```python
   from PIL import Image, ImageEnhance
   
   img = Image.open(path).convert('L')  # Grayscale
   enhancer = ImageEnhance.Contrast(img)
   img = enhancer.enhance(2)  # Increase contrast
   ```

2. **Try different config:**
   ```python
   pytesseract.image_to_string(img, config='--psm 6')
   # PSM 6 = Assume uniform block of text
   ```

3. **Higher quality screenshot:**
   - Ask Janice for higher-res version
   - Ensure screenshot isn't compressed

### Issue: Module Import Errors

**Symptom:** "ModuleNotFoundError: No module named 'X'"

**Fix:**
```bash
# Python
pip install [module-name]

# Node.js
npm install [module-name]
```

### Issue: File Path Problems

**Symptom:** "FileNotFoundError" or similar

**Fix:**
- Use absolute paths initially
- Check current working directory: `pwd` (bash) or `echo %cd%` (Windows CMD)
- Verify file actually exists: `ls data/screenshots/`

---

## Communication Style with Janice

### Do This:
- **Lead with the answer** → "Built the OCR reader, it's working"
- **Be direct** → "Found a bug in line 23, fixed it"
- **Show results** → "Here's the output: [paste]"
- **Ask specific questions** → "Should I prioritize Quicken or QuickBooks first?"

### Don't Do This:
- "Let me know if you need anything else" ❌
- "I can build this, or I could try that..." ❌ (just pick best option)
- Long explanations of how things work ❌ (unless asked)
- "I apologize, but..." ❌ (just state the issue and fix)

### Decision-Making
- **Make small decisions yourself** (variable names, file structure)
- **Ask about big decisions** (architecture changes, scope additions)
- **Test fast, iterate** (don't overthink)

---

## Key Files Reference

### Must-Read Files (In Order)
1. **DEVELOPMENT_LOG.md** → Current progress
2. **PROJECT_OVERVIEW.md** → Full context
3. **README.md** → How to run
4. **TROUBLESHOOTING.md** → Common issues

### Code Entry Points
- **Python:** `src/main.py` or `src/__init__.py`
- **Node.js:** `src/index.js` or check `package.json` "main" field

### Configuration Files
- **accounts.json** → Account metadata (if exists)
- **goals.json** → Financial targets (if exists)

---

## Success Criteria by Phase

### Phase 1: Foundation
✅ Screenshot → text extraction works  
✅ Can identify currency amounts  
✅ Test with fake bank statement passes  

### Phase 2: Data Extraction
✅ Text → structured JSON works  
✅ Handles Quicken, QuickBooks, bank formats  
✅ Error handling for bad inputs  

### Phase 3: Calculations
✅ Debt payoff projections accurate  
✅ Retirement trajectory correct  
✅ September 2026 countdown working  

### Phase 4: Dashboard
✅ Markdown output generates  
✅ HTML version looks good  
✅ Mobile-friendly display  

### Phase 5: Real Data
✅ Works with Janice's screenshots  
✅ 95%+ accuracy  
✅ Actionable insights clear  

### Phase 6: Notion Sync
✅ Data appears in Notion correctly  
✅ No manual intervention needed  

---

## Emergency Contacts

### If Totally Stuck

**Ask Janice:**
- "Can you share what Claude said about [specific issue]?"
- "Do you have a sample of what the output should look like?"
- "Should I simplify this part and move on?"

**Fallback Options:**
- Build a simpler version that works
- Document the blocker clearly for Claude
- Focus on what you CAN build

**Remember:** Progress > perfection. A working simple version beats a broken complex one.

---

## Quick Command Reference

### File Operations
```bash
# List files
ls -la

# View file
cat filename.md

# Edit file
nano filename.md  # or vim, or open in IDE

# Create directory
mkdir -p path/to/folder
```

### Git Commands
```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Description of changes"

# View history
git log --oneline
```

### Python
```bash
# Run script
python src/main.py

# Install package
pip install package-name

# List installed
pip list
```

### Node.js
```bash
# Run script
node src/index.js

# Install package
npm install package-name

# List installed
npm list
```

---

## Final Checklist Before Ending Session

- [ ] Code works (tested it yourself)
- [ ] DEVELOPMENT_LOG.md updated
- [ ] Code committed to git
- [ ] Clear notes for Claude
- [ ] Told Janice what's done and what's next
- [ ] No loose ends or half-built features

---

**Remember:** You're the backup quarterback. Keep the game moving forward. Claude will appreciate finding a solid foundation when he returns. Janice will appreciate seeing progress. You've got this!

---

**End of Gemini Quick Start**

*Refer back to PROJECT_OVERVIEW.md for detailed context on anything not covered here.*
