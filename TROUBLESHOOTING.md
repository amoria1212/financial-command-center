# Financial Command Center - Troubleshooting Guide

## Purpose
Quick solutions to common problems encountered during development or daily use of the Financial Command Center.

---

## Installation Issues

### Tesseract OCR Not Found

**Symptoms:**
- Error: "tesseract: command not found"
- Error: "TesseractNotFoundError"
- OCR functions fail immediately

**Solutions:**

**Windows:**
```powershell
# Option 1: Chocolatey (if you have it)
choco install tesseract

# Option 2: Manual download
# Go to: https://github.com/UB-Mannheim/tesseract/wiki
# Download Windows installer
# Run installer
# Add to PATH:
#   - Open System Properties > Environment Variables
#   - Edit PATH variable
#   - Add: C:\Program Files\Tesseract-OCR
# Restart terminal

# Verify:
tesseract --version
```

**Mac:**
```bash
brew install tesseract
tesseract --version
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
tesseract --version
```

**Still not working?**
- Restart your terminal/computer
- Check PATH: `echo $PATH` (Mac/Linux) or `echo %PATH%` (Windows)
- Try full path: `/usr/local/bin/tesseract` (Mac) or `C:\Program Files\Tesseract-OCR\tesseract.exe` (Windows)

---

### Python Module Not Found

**Symptoms:**
- "ModuleNotFoundError: No module named 'pytesseract'"
- "ImportError: cannot import name 'X'"

**Solutions:**

**Check Python version:**
```bash
python --version  # Should be 3.9+
```

**Install missing modules:**
```bash
pip install pytesseract pillow opencv-python pandas notion-client

# If using Python 3:
pip3 install pytesseract pillow opencv-python pandas notion-client

# If permission denied:
pip install --user pytesseract pillow opencv-python pandas notion-client
```

**Multiple Python versions?**
```bash
# Use specific version
python3.9 -m pip install pytesseract
python3.10 -m pip install pytesseract
```

**Virtual environment issues:**
```bash
# Create new venv
python -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

---

### Node.js Package Errors

**Symptoms:**
- "Cannot find module 'tesseract.js'"
- "npm ERR! code ENOENT"

**Solutions:**

**Initialize npm (if new project):**
```bash
npm init -y
```

**Install dependencies:**
```bash
npm install tesseract.js sharp canvas notion-client
```

**Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Node version issues:**
```bash
# Check version
node --version  # Should be 18+

# Update if needed
# Download from: https://nodejs.org
```

---

### Git for Windows Missing

**Symptoms:**
- "git: command not found" (Claude Code won't run)

**Solution:**
```
Download: https://git-scm.com/download/win
Run installer with default settings
Restart terminal
Verify: git --version
```

---

## OCR & Data Extraction Issues

### Low Accuracy / Wrong Numbers

**Symptoms:**
- Balance shows as "$5,ZB4" instead of "$5,234"
- Dates extracted incorrectly
- Account names garbled

**Quick Fixes:**

**1. Improve screenshot quality:**
```bash
# Take new screenshot with:
- Higher resolution (1920x1080 minimum)
- No glare or reflections
- Zoom in before capture
- Full screen, no overlapping windows
```

**2. Preprocess the image:**

*Python:*
```python
from PIL import Image, ImageEnhance
import cv2
import numpy as np

def preprocess_image(image_path):
    # Convert to grayscale
    img = Image.open(image_path).convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    
    # Save preprocessed version
    img.save('temp_preprocessed.png')
    
    return 'temp_preprocessed.png'

# Use preprocessed image for OCR
clean_image = preprocess_image('data/screenshots/quicken.png')
text = pytesseract.image_to_string(Image.open(clean_image))
```

**3. Try different Tesseract configs:**
```python
# Config for numbers
text = pytesseract.image_to_string(img, config='--psm 6 -c tessedit_char_whitelist=0123456789$,.')

# Config for text
text = pytesseract.image_to_string(img, config='--psm 6')

# Config for dense text
text = pytesseract.image_to_string(img, config='--psm 4')
```

**PSM (Page Segmentation Mode) options:**
- `--psm 3` = Fully automatic (default)
- `--psm 4` = Assume single column of text
- `--psm 6` = Assume uniform block of text
- `--psm 7` = Treat image as single text line
- `--psm 8` = Treat image as single word

**4. Manual verification mode:**
```bash
python src/main.py --verify-amounts
# Prompts you to confirm each extracted number
```

---

### Missing Data in Dashboard

**Symptoms:**
- Dashboard shows $0.00 for accounts you know have balances
- Some accounts missing entirely
- "No data found" errors

**Diagnostics:**

**1. Check extraction log:**
```bash
cat logs/extraction.log
# Look for errors or warnings
```

**2. Test OCR directly:**
```python
from PIL import Image
import pytesseract

img = Image.open('data/screenshots/problematic.png')
text = pytesseract.image_to_string(img)
print(text)  # Does it contain the expected data?
```

**3. Verify file paths:**
```python
import os

# List all screenshots
screenshots = os.listdir('data/screenshots/')
print(screenshots)

# Check if files are readable
for f in screenshots:
    path = f'data/screenshots/{f}'
    print(f"{f}: {os.path.exists(path)} - {os.path.getsize(path)} bytes")
```

**Solutions:**

**Missing accounts:**
- Add to `config/accounts.json`
- Ensure name matches screenshot exactly (or use fuzzy matching)

**Zero balances:**
- Check if screenshot actually shows balances (not summary page)
- Verify regex patterns in parser match your format

**No data extracted:**
- Screenshot may be too low quality
- Try different file format (PNG vs JPG)
- Retake screenshot with better clarity

---

### Incorrect Parsing

**Symptoms:**
- Extracts wrong account name
- Gets date format wrong (12/25/2025 vs 25/12/2025)
- Misidentifies currency ($2,500 vs 2.500 EUR)

**Solutions:**

**1. Add custom regex patterns:**

*For currency:*
```python
import re

# US format: $2,500.00
pattern_us = r'\$\s*([\d,]+\.?\d{0,2})'

# EU format: 2.500,00 €
pattern_eu = r'([\d\.]+,\d{2})\s*€'

def extract_amount(text, locale='US'):
    if locale == 'US':
        match = re.search(pattern_us, text)
        if match:
            return float(match.group(1).replace(',', ''))
    # Add other locales as needed
```

*For dates:*
```python
from dateutil import parser

def extract_date(text):
    try:
        # Auto-detect format
        date = parser.parse(text)
        return date.strftime('%Y-%m-%d')
    except:
        return None
```

**2. Configure for your platform:**

Edit `src/processors/quicken_parser.py` (or similar) to match Quicken Simplifi's exact layout:
```python
QUICKEN_PATTERNS = {
    'checking_balance': r'Checking Account.*?\$\s*([\d,]+\.?\d{0,2})',
    'savings_balance': r'Savings Account.*?\$\s*([\d,]+\.?\d{0,2})',
    'date': r'as of\s+(\d{1,2}/\d{1,2}/\d{4})'
}
```

**3. Use multiple patterns (fallback):**
```python
def extract_balance(text):
    patterns = [
        r'Balance:\s*\$\s*([\d,]+\.?\d{0,2})',
        r'Current Balance:\s*\$\s*([\d,]+\.?\d{0,2})',
        r'Available:\s*\$\s*([\d,]+\.?\d{0,2})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return float(match.group(1).replace(',', ''))
    
    return None  # No match found
```

---

## Calculation Issues

### Debt Payoff Dates Don't Match Manual Calculation

**Symptoms:**
- Tool says "June 2026" but your spreadsheet says "August 2026"
- Interest calculations seem off

**Diagnostics:**

**1. Check inputs:**
```python
# In Python console or debug mode
account = accounts['Amex Blue']
print(f"Balance: ${account['current_balance']}")
print(f"Interest Rate: {account['interest_rate']}%")
print(f"Monthly Payment: ${account['monthly_payment']}")
```

**2. Verify calculation logic:**

*Expected formula (for reference):*
```
Monthly Interest = Balance × (APR / 12 / 100)
Principal Payment = Monthly Payment - Monthly Interest
New Balance = Balance - Principal Payment
Months to Payoff = log(Payment / (Payment - Interest)) / log(1 + (APR/12/100))
```

**Solutions:**

**Rounding errors:**
```python
# Use Decimal for precision
from decimal import Decimal, ROUND_HALF_UP

balance = Decimal('5234.00')
rate = Decimal('21.49')
payment = Decimal('500.00')

monthly_rate = rate / Decimal('12') / Decimal('100')
# Continue with Decimal arithmetic
```

**Compound interest:**
```python
# Ensure daily compounding if applicable
daily_rate = annual_rate / 365
monthly_interest = balance * ((1 + daily_rate) ** 30 - 1)
```

**Extra payments:**
```python
# Verify extra payments are applied to principal
principal_payment = monthly_payment - interest
if principal_payment < 0:
    print("ERROR: Payment doesn't cover interest!")
```

---

### Retirement Projections Seem Too Optimistic/Pessimistic

**Symptoms:**
- "You'll have $5M by age 72!" (seems unrealistic)
- "You'll only have $200K by age 72" (seems too low)

**Check assumptions in `config/goals.json`:**
```json
{
  "retirement": {
    "annual_return": 7.0,    // ← Check this
    "current_age": 57,        // ← And this
    "target_age": 72,
    "monthly_contribution": 4000  // ← And this
  }
}
```

**Common issues:**

**1. Incorrect return rate:**
- 7% is reasonable for stocks
- 4% is conservative
- 10% is aggressive (don't use unless you're very confident)

**2. Wrong contribution amount:**
- Make sure it's monthly (not annual)
- Include employer contributions (if applicable)
- Account for catch-up contributions (age 50+)

**3. Forgot current balance:**
```python
# Verify starting point
current_balance = accounts['Solo 401(k)']['current_balance']
print(f"Starting balance: ${current_balance}")
```

**Recalculate manually:**
```python
def future_value(present_value, monthly_contribution, annual_return, years):
    months = years * 12
    monthly_return = annual_return / 12 / 100
    
    # Future value of current balance
    fv_balance = present_value * (1 + monthly_return) ** months
    
    # Future value of contributions
    fv_contributions = monthly_contribution * (((1 + monthly_return) ** months - 1) / monthly_return)
    
    return fv_balance + fv_contributions

# Test:
result = future_value(125000, 4000, 7.0, 15)
print(f"Projected: ${result:,.2f}")
```

---

## Dashboard Display Issues

### Dashboard Won't Open / Renders Incorrectly

**Symptoms:**
- HTML file opens but shows blank page
- Markdown doesn't format properly
- Charts missing or broken

**Solutions:**

**Blank HTML page:**
```bash
# Check browser console for errors
# Right-click > Inspect > Console tab

# Common issues:
# 1. Missing CSS/JS files
# 2. Incorrect file paths
# 3. JavaScript errors
```

**Fix file paths:**
```html
<!-- Wrong (absolute path) -->
<link rel="stylesheet" href="/outputs/styles.css">

<!-- Right (relative path) -->
<link rel="stylesheet" href="./styles.css">
```

**Test with simple HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Dashboard</title>
</head>
<body>
    <h1>Financial Dashboard</h1>
    <p>If you see this, HTML rendering works.</p>
</body>
</html>
```

**Markdown not formatting:**
- Ensure you're opening .md files in a markdown viewer
- Try converting to HTML: `python -m markdown dashboard.md > dashboard.html`

**Charts missing:**
```python
# If using Chart.js or similar
# Make sure CDN links are correct and accessible

# Test in HTML:
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  console.log('Chart.js version:', Chart.version);
</script>
```

---

### Dashboard Not Mobile-Friendly

**Symptoms:**
- Text too small on phone
- Have to scroll horizontally
- Tables don't fit screen

**Solutions:**

**Add viewport meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Use responsive CSS:**
```css
/* Make tables scrollable */
.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

/* Scale text for mobile */
@media (max-width: 768px) {
    body {
        font-size: 14px;
    }
    
    h1 {
        font-size: 24px;
    }
}

/* Stack columns on mobile */
@media (max-width: 768px) {
    .flex-row {
        flex-direction: column;
    }
}
```

---

## Notion Integration Issues

### "Invalid API Key" or "Unauthorized"

**Symptoms:**
- Error: "Invalid API Key"
- Error: "Unauthorized"
- Notion sync fails immediately

**Solutions:**

**1. Check .env file exists:**
```bash
ls -la .env
# If not found, create it
```

**2. Verify API key format:**
```
# .env file should look like:
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# No quotes, no spaces, no extra lines
```

**3. Regenerate API key:**
- Go to: https://www.notion.so/my-integrations
- Click your integration
- Click "Regenerate Token"
- Copy new token
- Update .env file

**4. Check integration permissions:**
- Open Notion database
- Click "..." menu > "Connections"
- Ensure your integration is listed
- If not, click "Add connections" and select it

---

### Data Not Appearing in Notion

**Symptoms:**
- Script says "Success" but no data in Notion
- Some fields empty
- Date format wrong

**Diagnostics:**

**1. Check database schema:**
```bash
python src/main.py --check-notion-schema
# Should show all properties and types
```

**2. Verify property names match:**

*In code:*
```python
notion_data = {
    'Date': today,
    'Total Debt': total_debt,
    'Retirement Balance': retirement_balance
}
```

*In Notion:*
- Must have properties named exactly "Date", "Total Debt", "Retirement Balance"
- Case-sensitive!
- Check for extra spaces

**3. Test with simple data:**
```python
from notion_client import Client

notion = Client(auth="secret_xxx")

# Try creating a simple page
response = notion.pages.create(
    parent={"database_id": "xxx"},
    properties={
        "Name": {
            "title": [{"text": {"content": "Test"}}]
        }
    }
)

print(response)  # Should show success
```

**Solutions:**

**Property type mismatch:**
```python
# Notion expects specific formats

# Date (ISO format)
'Date': {
    'date': {
        'start': '2025-11-06'
    }
}

# Number
'Total Debt': {
    'number': 5234.00
}

# Checkbox
'On Track': {
    'checkbox': True
}

# Title (required for every page)
'Name': {
    'title': [
        {'text': {'content': 'Financial Snapshot 2025-11-06'}}
    ]
}
```

**Wrong database ID:**
```python
# Get database ID from URL:
# https://notion.so/workspace/xxxxx?v=yyyyy
#                          ^^^^^
#                          This is the database ID (not the view ID!)

# Test it:
database = notion.databases.retrieve(database_id="xxxxx")
print(database['title'])  # Should show database name
```

---

## Performance Issues

### Tool Running Very Slowly

**Symptoms:**
- Takes > 30 seconds to process one screenshot
- Dashboard generation hangs
- Computer fans spin up

**Solutions:**

**1. Check image size:**
```bash
ls -lh data/screenshots/
# If files are > 10MB, they're too big
```

**Resize large images:**
```python
from PIL import Image

def resize_screenshot(input_path, output_path, max_width=1920):
    img = Image.open(input_path)
    
    # Calculate new dimensions
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
    
    img.save(output_path, optimize=True)

# Use:
resize_screenshot('data/screenshots/huge.png', 'data/screenshots/optimized.png')
```

**2. Use caching:**
```python
import hashlib
import json

def get_cache_key(image_path):
    with open(image_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def load_from_cache(cache_key):
    cache_file = f'data/cache/{cache_key}.json'
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as f:
            return json.load(f)
    return None

# Check cache before OCR:
cache_key = get_cache_key('data/screenshots/quicken.png')
cached_data = load_from_cache(cache_key)
if cached_data:
    print("Using cached data")
    data = cached_data
else:
    print("Running OCR...")
    data = extract_data('data/screenshots/quicken.png')
    save_to_cache(cache_key, data)
```

**3. Parallel processing:**
```python
from concurrent.futures import ThreadPoolExecutor

def process_all_screenshots(screenshot_paths):
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(process_screenshot, screenshot_paths))
    return results

# Much faster for multiple screenshots
```

---

## Data Management Issues

### Old Screenshots Filling Up Disk

**Solution:**
```bash
# Move old screenshots to archives
python src/utils/archive_old_data.py --older-than 90  # Archive files > 90 days old

# Or manually:
mkdir -p data/archives/2025-Q1
mv data/screenshots/2025-01-*.png data/archives/2025-Q1/
mv data/screenshots/2025-02-*.png data/archives/2025-Q1/
mv data/screenshots/2025-03-*.png data/archives/2025-Q1/
```

---

### Lost Historical Data

**Symptoms:**
- Accidentally deleted screenshots
- Can't compare to previous months
- Need data from 6 months ago

**Prevention:**
```bash
# Set up automatic backups (run weekly)
#!/bin/bash
# backup.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="backups/$DATE"

mkdir -p "$BACKUP_DIR"
cp -r data/ "$BACKUP_DIR/data"
cp -r outputs/ "$BACKUP_DIR/outputs"
cp config/* "$BACKUP_DIR/"

echo "Backup created: $BACKUP_DIR"
```

**Recovery:**
```bash
# If you have a backup
cp -r backups/2025-10-01/data/ data/

# If you synced to Notion
python src/utils/export_from_notion.py --start-date 2025-04-01 --end-date 2025-10-01
# Exports historical Notion data back to local files
```

---

## Handoff Issues (Claude ↔ Gemini)

### Gemini Can't Find Project Files

**Solution:**
```bash
# Ensure Gemini has the right path
pwd  # Show current directory

# Navigate to project
cd ~/financial-command-center

# Verify files exist
ls -la

# If missing, download from:
# (wherever Claude uploaded them - check chat history)
```

---

### Gemini Using Different Approach Than Claude

**Solution:**
- Reference DEVELOPMENT_LOG.md for architecture decisions
- Ask Janice: "Did Claude use Python or Node.js?"
- Stick to the established pattern (don't rewrite working code)

---

### Can't Resume After Handoff

**Checklist:**
1. [ ] Read DEVELOPMENT_LOG.md (last entry)
2. [ ] Check git log: `git log --oneline -n 5`
3. [ ] Test current code: `python src/main.py` or `node src/index.js`
4. [ ] Identify what's missing: Compare to PROJECT_OVERVIEW.md phase checklist
5. [ ] Continue from next incomplete task

---

## Getting Unstuck

### "I've Tried Everything, Still Broken"

**Step 1: Simplify**
- Build the absolute simplest version that could work
- Get that working first
- Add complexity incrementally

**Example:**
Instead of:
```python
def process_all_accounts(screenshots):
    # 200 lines of complex code
```

Try:
```python
def process_one_account(screenshot):
    # 10 lines of simple code
    text = extract_text(screenshot)
    balance = find_balance(text)
    return balance

# Test with ONE screenshot
result = process_one_account('test.png')
print(result)  # Does THIS work?
```

**Step 2: Add logging**
```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='debug.log'
)

# Add throughout code:
logging.debug(f"Processing {filename}")
logging.info(f"Extracted text: {text[:100]}")
logging.warning(f"Low confidence: {confidence}")
logging.error(f"Failed to parse: {error}")
```

**Step 3: Ask for help**

*To Janice:*
"I'm stuck on [specific problem]. Here's what I've tried: [list]. Can you provide [specific info needed]?"

*To Claude (when back):*
"Gemini got stuck at [specific step]. Here's the error: [paste]. Here's the code: [paste]. What am I missing?"

---

## Emergency Fallbacks

### If OCR Completely Fails

**Manual entry mode:**
```bash
python src/main.py --manual-entry
# Prompts you to type in balances
# Faster than fixing OCR, useful for quick check-in
```

### If Dashboard Generation Fails

**Export to CSV:**
```bash
python src/main.py --export-csv
# Creates simple CSV you can open in Excel
# Better than nothing
```

### If Everything Breaks

**Nuclear option (start fresh):**
```bash
# Backup current code
cp -r src src_backup_$(date +%Y%m%d)

# Reset to last working commit
git log --oneline  # Find last good commit
git reset --hard [commit-hash]

# Or start from scratch
mv ~/financial-command-center ~/financial-command-center_old
# Re-clone/restart project
```

---

## Preventive Maintenance

### Weekly Checklist

- [ ] Run tool with latest screenshots
- [ ] Check for deprecation warnings in logs
- [ ] Verify Notion sync still working
- [ ] Update accounts.json if any accounts changed

### Monthly Checklist

- [ ] Backup entire project folder
- [ ] Archive old screenshots (> 3 months)
- [ ] Review calculation accuracy (compare to manual check)
- [ ] Update goals.json if targets changed

### Quarterly Checklist

- [ ] Review and update regex patterns if platforms changed layouts
- [ ] Check for Notion API updates
- [ ] Test full pipeline with fresh screenshots
- [ ] Update README with any new learnings

---

**End of Troubleshooting Guide**

*Still stuck? Document the issue in DEVELOPMENT_LOG.md and ask Claude or Gemini for help in the next session.*
