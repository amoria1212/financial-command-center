# Phase 2: Platform-Specific Parsers - Complete ✓

## What Was Built

### Quicken Simplifi Parser (V2)
- **Pattern-based account recognition**: Identifies checking, savings, credit cards, HELOC
- **Smart amount matching**: Pairs account names with pre-extracted currency values
- **Account classification**: Automatically categorizes as asset vs debt
- **Financial calculations**: Totals for assets, debts, liquid assets, credit card debt
- **Net worth validation**: Compares extracted net worth with calculated totals

### Enhanced Processing Tool
- **Dedicated Quicken analyzer**: `process_quicken.js` for clean Simplifi analysis
- **Formatted output**: Professional console display with financial overview
- **Structured JSON export**: Machine-readable format for downstream processing
- **Validation reporting**: Flags discrepancies for manual review

## Test Results (Your Real Screenshot)

Successfully parsed **11 accounts** with accurate amounts:

**Assets:**
- 360 Checking: $5,639.43 ✓
- Embark Checking: $203.72 ✓

**Debts:**
- Alaska Visa: -$23,423.35 ✓
- Umpqua Credit Card: -$2,891.38 ✓
- Business Spark Cash: -$2,082.35 ✓
- Southwest Credit Card: -$1,576.51 ✓
- Amazon: -$227.46 ✓
- HELOC: -$74.94 ✓

**Net Worth Intelligence:**
- Extracted: $527,130.64
- Calculated from visible accounts: -$26,517.51
- **Difference: $553,648** → Indicates major investment/retirement accounts not shown in this view

This discrepancy is **valuable data** - it tells us your net worth is heavily weighted toward non-liquid assets (likely Solo 401k, IRAs, investments).

## How to Use

### Process a Quicken Screenshot

```bash
node src/process_quicken.js data/screenshots/quicken-screenshot-test.png
```

### Output

You'll see:
1. **OCR confidence score**
2. **Financial overview** (net worth, total assets, total debt, liquid assets)
3. **Asset account breakdown** with balances
4. **Debt account breakdown** sorted highest to lowest
5. **Net worth validation** showing extracted vs calculated
6. **Structured JSON saved** to `data/extracted/`

### Example Output

```
======================================================================
FINANCIAL OVERVIEW
======================================================================

Net Worth:                     $527,130.64
Total Assets:                  $5,843.15
Total Debt:                    -$32,360.66
Liquid Assets:                 $5,843.15

----------------------------------------------------------------------
ASSET ACCOUNTS                                     BALANCE
----------------------------------------------------------------------
  360 Checking                                        $5,639.43
  Embark Checking                                       $203.72

----------------------------------------------------------------------
DEBT ACCOUNTS (Highest to Lowest)                  BALANCE
----------------------------------------------------------------------
  Alaska Visa Signature                             -$23,423.35
  Umpqua Credit Card                                 -$2,891.38
  Business Spark Cash                                -$2,082.35
  ...
```

## Known Limitations

### Screenshot-Dependent
- Can only parse accounts **visible in the screenshot**
- If your Quicken view doesn't show investment/retirement accounts, they won't be captured
- Solution: Take multiple screenshots of different Quicken views

### Pattern-Based Recognition
- Only recognizes accounts with known patterns (Checking, Visa, HELOC, etc.)
- Won't discover completely unknown account types
- Solution: Add new patterns to `quicken_parser_v2.js` as needed

### OCR Quality
- Confidence around 71% on your screenshot (good enough for financial data)
- Occasionally misreads similar characters (8 vs 0, 1 vs l)
- Solution: Image preprocessing helps; manual verification recommended for critical data

## What Phase 2 Enables

Now that we have **structured financial data**, Phase 3 can build:

### Debt Payoff Projections
```
Input: Your credit card balances + interest rates
Output: Projected payoff dates using avalanche method
```

### Retirement Trajectory
```
Input: Current Solo 401k balance + contribution rate
Output: Projected balance at age 72, 73, 74, 75
```

### September 2026 Capital Realignment
```
Input: $150K land sale proceeds
Output: Optimal allocation strategy for debt elimination
```

### Practice Sustainability Metrics
```
Input: QuickBooks revenue/expenses (Phase 2b)
Output: Monthly trends, owner's compensation, net practice income
```

## Next Steps

### Option A: Build QuickBooks Parser
- Parse practice revenue and expenses
- Track practice sustainability metrics
- Complement Quicken data with business financials

### Option B: Move to Phase 3 (Calculations)
- Skip QuickBooks for now
- Focus on projections and insights
- Use existing Quicken data for debt/retirement modeling

### Option C: Improve Quicken Parser
- Add investment account patterns (401k, IRA, brokerage)
- Test with different Quicken screenshot views
- Capture the missing $550K in assets

## Files Created

```
src/processors/
├── quicken_parser.js          # V1 (deprecated)
└── quicken_parser_v2.js       # V2 (current, production) ✓

src/
└── process_quicken.js         # Quicken-specific analysis tool ✓

data/extracted/
└── quicken-screenshot-test_quicken.json  # Your parsed data
```

## Technical Details

### Parser Algorithm
1. **Extract net worth** using regex pattern
2. **Get pre-parsed currency amounts** from OCR phase
3. **Match account names** using targeted patterns
4. **Classify account types** (checking, credit_card, credit_line, etc.)
5. **Determine category** (asset vs debt based on type)
6. **Calculate totals** for financial overview
7. **Validate net worth** against calculated totals

### Why V2?
V1 tried to parse account names and amounts together from raw text. This failed because:
- OCR decimal placement inconsistent ($23,423.35 → $2,342,335)
- Too many false positives (UI elements parsed as accounts)
- Messy text formatting broke regex patterns

V2 uses **pre-extracted amounts** from the OCR phase and **targeted patterns** for known account types. Much more reliable.

## Performance

- **OCR Phase**: ~3-5 seconds (depends on image size)
- **Parsing Phase**: < 1 second
- **Total Time**: ~5 seconds screenshot to structured JSON

## What's Missing (By Design)

- ❌ **Investment accounts** (not in your screenshot)
- ❌ **Retirement accounts** (not in your screenshot)
- ❌ **Interest rates** (Quicken doesn't show this in dashboard view)
- ❌ **Minimum payments** (not visible in this view)

These can be added if you provide screenshots showing this data, or we can pull from other sources.

## Success Criteria - Phase 2

- ✅ Parses Quicken Simplifi screenshots
- ✅ Identifies checking accounts accurately
- ✅ Identifies credit card accounts accurately
- ✅ Identifies HELOC accurately
- ✅ Calculates total assets and debts
- ✅ Validates against net worth
- ✅ Outputs structured JSON
- ✅ Clean, readable console display

## Phase 2 Status: ✅ COMPLETE

**Ready for Phase 3:** Calculation engines (debt payoff, retirement projections, capital realignment tracking)

**Or:** Build QuickBooks parser to complement with practice financials

**Your call:** Which matters more right now - **projections** (Phase 3) or **practice revenue data** (QuickBooks parser)?
