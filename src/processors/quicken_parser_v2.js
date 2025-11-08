/**
 * Quicken Simplifi Parser V2
 *
 * Parses Quicken Simplifi screenshots to extract account balances and net worth
 * Uses pattern-based account recognition and pre-extracted currency amounts
 */

class QuickenParser {
  constructor() {
    this.accountPatterns = {
      checking: /(?:360|Embark|Ally|Chase|Wells Fargo|Bank of America)?\s?Checking/i,
      savings: /(?:360|Ally|Marcus)?\s?Savings?/i,
      credit_card: /(?:Alaska|AMEX|Umpqua|Business Spark|Southwest|Amazon|Discover|VERE|Capital One).*(?:Visa|Card|AMEX)/i,
      credit_line: /HELOC|Home Equity|Line of Credit/i
    };
  }

  /**
   * Parse Quicken Simplifi screenshot data
   */
  parse(ocrData) {
    const result = {
      source: 'quicken',
      extractedDate: ocrData.extractedDate || new Date().toISOString(),
      netWorth: this.extractNetWorth(ocrData.rawText),
      accounts: [],
      totalAssets: 0,
      totalDebt: 0,
      liquidAssets: 0,
      creditCardDebt: 0
    };

    // Parse accounts from OCR data
    result.accounts = this.extractAccounts(ocrData);

    // Calculate totals
    this.calculateTotals(result);

    return result;
  }

  /**
   * Extract net worth from OCR text
   */
  extractNetWorth(text) {
    const netWorthPattern = /Net\s+Worth[:\s]+\$?\s?([\d,]+\.?\d*)/i;
    const match = text.match(netWorthPattern);

    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      return isNaN(value) ? null : value;
    }

    return null;
  }

  /**
   * Extract accounts by matching patterns with amounts
   */
  extractAccounts(ocrData) {
    const accounts = [];
    const lines = ocrData.lines || [];
    const amounts = ocrData.amounts || [];

    // Try to match account names with nearby amounts
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check each account pattern
      for (const [type, pattern] of Object.entries(this.accountPatterns)) {
        if (pattern.test(line)) {
          // Found an account name, find nearby amount
          const account = {
            name: this.cleanAccountName(line),
            type: type,
            balance: 0
          };

          // Look for amount in current line or next few lines
          for (let j = 0; j < amounts.length; j++) {
            const amount = amounts[j];
            // Simple heuristic: use next available amount
            if (Math.abs(i - this.findLineIndex(lines, amount.text)) <= 2) {
              account.balance = this.determineBalance(amount.value, type);
              break;
            }
          }

          // Only add if we found a balance
          if (account.balance !== 0 || account.name) {
            accounts.push(account);
          }

          break; // Found a match, move to next line
        }
      }
    }

    return accounts;
  }

  /**
   * Clean account name from OCR text
   */
  cleanAccountName(text) {
    // Remove common OCR artifacts and extra whitespace
    return text
      .replace(/[|\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Find line index containing text
   */
  findLineIndex(lines, searchText) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Determine if balance should be negative (debt) or positive (asset)
   */
  determineBalance(value, accountType) {
    // Credit cards and lines of credit are debts (negative)
    if (accountType === 'credit_card' || accountType === 'credit_line') {
      return -Math.abs(value);
    }

    // Checking and savings are assets (positive)
    return Math.abs(value);
  }

  /**
   * Calculate totals from accounts
   */
  calculateTotals(result) {
    for (const account of result.accounts) {
      if (account.balance < 0) {
        result.totalDebt += account.balance;
        if (account.type === 'credit_card') {
          result.creditCardDebt += account.balance;
        }
      } else {
        result.totalAssets += account.balance;
        if (account.type === 'checking' || account.type === 'savings') {
          result.liquidAssets += account.balance;
        }
      }
    }

    // Round to 2 decimal places
    result.totalAssets = Math.round(result.totalAssets * 100) / 100;
    result.totalDebt = Math.round(result.totalDebt * 100) / 100;
    result.liquidAssets = Math.round(result.liquidAssets * 100) / 100;
    result.creditCardDebt = Math.round(result.creditCardDebt * 100) / 100;
  }
}

module.exports = QuickenParser;
