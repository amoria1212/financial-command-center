# Testing Checklist for Janice

**System**: Financial Command Center
**Date Created**: 2025-11-07
**Current Status**: All systems operational, October baseline synced

---

## Quick System Health Check

Run these commands to verify everything is working:

### 1. Test Notion Connection
```bash
npm run notion -- --test
```

**Expected result**:
```
✓ Connected to database: "Financial Metrics Tracker"
Connection test successful!
```

**If it fails**: Check that database is still shared with integration in Notion

---

### 2. Verify October Data in Notion

**Action**: Open your Notion database
**Link**: https://www.notion.so/2a4ef17420a9817e98c6d480964ffba0

**Check for**:
- [ ] Row with October 2024 data
- [ ] Net Worth: $527,130.64
- [ ] Practice Revenue: $128,412.14
- [ ] Profit Margin: 43.1%
- [ ] All fields populated correctly

---

### 3. Generate Fresh Dashboard

```bash
npm run dashboard
```

**Expected result**:
- Dashboard opens in browser automatically
- Shows Personal Finances section (Quicken data)
- Shows Business Finances section (QuickBooks data)
- Key metrics visible and formatted correctly

**Check for**:
- [ ] Dashboard opens without errors
- [ ] Net worth displays correctly
- [ ] Practice revenue/expenses show
- [ ] Color coding looks good (green for positive, red for negative)
- [ ] No missing data warnings

---

### 4. Check Existing Data Files

```bash
dir data\extracted
```

**Expected files**:
- [ ] `quicken-screenshot-test_quicken.json` (October Quicken data)
- [ ] `October_quickbooks.json` (October QuickBooks data)

**To view a file**:
```bash
type data\extracted\October_quickbooks.json
```

---

## Test Processing New Data (Optional - if you have sample data)

### Test Quicken Processing

**If you have a Quicken screenshot**:

1. Put screenshot in `data/screenshots/`
2. Run:
   ```bash
   npm run quicken data/screenshots/your-screenshot.png
   ```
3. Check: New JSON file appears in `data/extracted/`
4. Check: Console shows extracted metrics

**Expected**:
- [ ] No errors during processing
- [ ] JSON file created successfully
- [ ] Key metrics extracted (net worth, assets, debt)

---

### Test QuickBooks Processing

**If you have a QuickBooks PDF**:

1. Put PDF in `data/` folder
2. Run:
   ```bash
   npm run quickbooks data/YourFile.pdf
   ```
3. Check: New JSON file appears in `data/extracted/`
4. Check: Console shows revenue, expenses, profit margin

**Expected**:
- [ ] No errors during processing
- [ ] JSON file created successfully
- [ ] Business metrics extracted correctly

---

### Test Bank Statement Processing

**If you have a bank statement PDF**:

1. Put PDF in `data/` folder
2. Run:
   ```bash
   npm run bank data/your-statement.pdf
   ```
3. Check: New JSON file appears in `data/extracted/`
4. Check: Transactions extracted

**Expected**:
- [ ] No errors during processing
- [ ] JSON file created successfully
- [ ] Transactions list extracted

---

## Test Full Workflow (When November Data Arrives)

**Complete monthly workflow test**:

1. **Process all data sources**:
   ```bash
   npm run quicken data/screenshots/quicken-nov.png
   npm run quickbooks data/November.pdf
   npm run bank data/bank-nov.pdf
   ```

2. **Generate dashboard**:
   ```bash
   npm run dashboard
   ```
   - [ ] Dashboard shows November data
   - [ ] All three sources integrated

3. **Sync to Notion**:
   ```bash
   npm run notion
   ```
   - [ ] Sync completes successfully
   - [ ] New row appears in Notion with November data
   - [ ] Console shows Notion page link

4. **Verify in Notion**:
   - [ ] November row visible in database
   - [ ] All metrics populated
   - [ ] Can compare October vs November

---

## Troubleshooting Checks

### If Notion sync fails

Run diagnostics:
```bash
npm run notion -- --test
```

**Common fixes**:
- Database connection lost → Re-share database with integration in Notion
- API key expired → Generate new key at https://www.notion.so/my-integrations
- Config file missing → Check `config/notion-config.json` exists

---

### If dashboard looks wrong

1. Check data files exist:
   ```bash
   dir data\extracted
   ```

2. Check a JSON file is valid:
   ```bash
   type data\extracted\October_quickbooks.json
   ```

3. Re-generate dashboard:
   ```bash
   npm run dashboard
   ```

---

### If processing fails

**Check file paths are correct**:
```bash
dir data\screenshots     # For Quicken
dir data                 # For PDFs
```

**Try processing with full path**:
```bash
npm run quicken "C:\Users\janic\OneDrive\Documents\Claude Vault\financial-command-center\data\screenshots\file.png"
```

---

## Monthly Testing Routine

**First week of each month** (after statements arrive):

- [ ] Process Quicken screenshot
- [ ] Process QuickBooks PDF
- [ ] Process bank statements
- [ ] Generate dashboard and review
- [ ] Sync to Notion
- [ ] Verify data in Notion
- [ ] Compare to previous month
- [ ] Note any trends or issues

---

## Notes Section

**Use this space to track issues or observations**:

**Date**: _______________

**What I tested**:


**What worked**:


**What didn't work**:


**Questions for Cipher**:


---

## Quick Reference Commands

```bash
# Health checks
npm run notion -- --test        # Test Notion connection
npm run dashboard               # Generate dashboard

# Processing
npm run quicken <file>          # Process Quicken
npm run quickbooks <file>       # Process QuickBooks
npm run bank <file>             # Process bank statement

# Sync
npm run notion                  # Sync to Notion

# View files
dir data\extracted              # See processed data
dir outputs\dashboards          # See generated dashboards
```

---

## Expected Behavior Summary

**System is working correctly if**:
✅ All commands run without errors
✅ JSON files appear in `data/extracted/`
✅ Dashboard generates and displays data correctly
✅ Notion sync creates/updates rows in database
✅ Data is accurate across all outputs

**System needs attention if**:
⚠️ Commands throw errors
⚠️ No JSON files generated
⚠️ Dashboard shows missing data
⚠️ Notion sync fails
⚠️ Numbers don't match source documents

---

**Status**: Ready for testing
**Last System Test**: 2025-11-07 (Notion connection successful, October baseline synced)
**Next Milestone**: Process November 2024 data when available
