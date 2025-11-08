/**
 * QuickBooks Parser
 *
 * Parses QuickBooks P&L statements (PDF or screenshot)
 * Extracts revenue, expenses, and calculates practice sustainability metrics
 */

class QuickBooksParser {
  constructor() {
    // Common revenue categories for therapy practice
    this.revenuePatterns = [
      /therapy.*(?:session|fee)/i,
      /insurance.*payment/i,
      /private.*pay/i,
      /medicare|medicaid/i,
      /client.*payment/i,
      /revenue/i,
      /income/i
    ];

    // Common expense categories
    this.expensePatterns = {
      'Rent': /(?:office\s)?rent/i,
      'Insurance': /insurance.*(?:liability|professional|health)/i,
      'Software': /software|technology|EHR|telehealth/i,
      'Continuing Education': /continuing\seducation|CE\s|training/i,
      'Marketing': /marketing|website|advertising/i,
      'Office Supplies': /office\ssupplies|supplies/i,
      'Utilities': /utilities|internet/i,
      'Accounting': /accounting|bookkeeping/i,
      'Legal': /legal|attorney/i,
      'Bank Fees': /bank\sfees?/i,
      'Owner Compensation': /owner.*comp|draw|salary/i,
      'Home Office': /home\soffice/i,
      'Medical Expenses': /medical\sexpense/i,
      'Interest': /interest\sexpense/i
    };
  }

  /**
   * Parse QuickBooks data from OCR
   */
  parse(ocrData) {
    const result = {
      source: 'quickbooks',
      extractedDate: ocrData.extractedDate || new Date().toISOString(),
      period: this.extractPeriod(ocrData.rawText),
      revenue: [],
      expenses: [],
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0,
      profitMargin: 0,
      sustainability: 'Unknown'
    };

    // Extract revenue and expense items
    this.extractRevenueExpenses(ocrData, result);

    // Calculate metrics
    this.calculateMetrics(result);

    // Assess sustainability
    this.assessSustainability(result);

    // Generate annual projections
    this.projectAnnual(result);

    return result;
  }

  /**
   * Extract time period from P&L
   */
  extractPeriod(text) {
    // Look for date ranges like "January 1-October 31, 2025"
    const periodPattern = /([A-Za-z]+\s+\d{1,2})\s*-\s*([A-Za-z]+\s+\d{1,2}),?\s*(\d{4})/i;
    const match = text.match(periodPattern);

    if (match) {
      return {
        text: match[0],
        startMonth: match[1],
        endMonth: match[2],
        year: match[3],
        months: this.calculateMonths(match[1], match[2])
      };
    }

    return { text: 'Unknown', months: 1 };
  }

  /**
   * Calculate number of months in period
   */
  calculateMonths(start, end) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    const startMonth = months.findIndex(m => start.includes(m));
    const endMonth = months.findIndex(m => end.includes(m));

    if (startMonth === -1 || endMonth === -1) return 1;

    return endMonth - startMonth + 1;
  }

  /**
   * Extract revenue and expense line items
   */
  extractRevenueExpenses(ocrData, result) {
    const lines = ocrData.lines || [];
    const amounts = ocrData.amounts || [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if this line is a revenue item
      for (const pattern of this.revenuePatterns) {
        if (pattern.test(line)) {
          // Find nearby amount
          const amount = this.findNearbyAmount(i, lines, amounts);
          if (amount) {
            result.revenue.push({
              category: this.cleanCategory(line),
              amount: Math.abs(amount)
            });
          }
          break;
        }
      }

      // Check if this line is an expense item
      for (const [category, pattern] of Object.entries(this.expensePatterns)) {
        if (pattern.test(line)) {
          const amount = this.findNearbyAmount(i, lines, amounts);
          if (amount) {
            result.expenses.push({
              category: category,
              amount: Math.abs(amount)
            });
          }
          break;
        }
      }
    }
  }

  /**
   * Find amount near a line index
   */
  findNearbyAmount(lineIndex, lines, amounts) {
    // Look in current line and next 2 lines
    for (let i = lineIndex; i < Math.min(lineIndex + 3, lines.length); i++) {
      const line = lines[i];
      for (const amount of amounts) {
        if (line.includes(amount.text)) {
          return amount.value;
        }
      }
    }
    return null;
  }

  /**
   * Clean category name
   */
  cleanCategory(text) {
    return text
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate financial metrics
   */
  calculateMetrics(result) {
    // Calculate totals
    result.totalRevenue = result.revenue.reduce((sum, item) => sum + item.amount, 0);
    result.totalExpenses = result.expenses.reduce((sum, item) => sum + item.amount, 0);
    result.netIncome = result.totalRevenue - result.totalExpenses;

    // Calculate profit margin
    if (result.totalRevenue > 0) {
      result.profitMargin = (result.netIncome / result.totalRevenue) * 100;
    }

    // Round values
    result.totalRevenue = Math.round(result.totalRevenue * 100) / 100;
    result.totalExpenses = Math.round(result.totalExpenses * 100) / 100;
    result.netIncome = Math.round(result.netIncome * 100) / 100;
    result.profitMargin = Math.round(result.profitMargin * 10) / 10;
  }

  /**
   * Assess practice sustainability
   */
  assessSustainability(result) {
    if (result.profitMargin >= 30) {
      result.sustainability = 'Excellent';
    } else if (result.profitMargin >= 20) {
      result.sustainability = 'Good';
    } else if (result.profitMargin >= 10) {
      result.sustainability = 'Moderate';
    } else if (result.profitMargin >= 5) {
      result.sustainability = 'Marginal';
    } else {
      result.sustainability = 'Concerning';
    }

    result.emergencyReserve = result.totalExpenses * 3; // 3 months of expenses
  }

  /**
   * Project annual metrics
   */
  projectAnnual(result) {
    const months = result.period.months || 1;
    const multiplier = 12 / months;

    result.projectedAnnualRevenue = Math.round(result.totalRevenue * multiplier * 100) / 100;
    result.projectedAnnualExpenses = Math.round(result.totalExpenses * multiplier * 100) / 100;
    result.projectedAnnualNetIncome = Math.round(result.netIncome * multiplier * 100) / 100;
  }
}

module.exports = QuickBooksParser;
