/**
 * Screenshot Reader - OCR Engine
 *
 * Handles image preprocessing and text extraction using Tesseract.js
 * Designed for financial document processing (screenshots and PDFs)
 */

const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ScreenshotReader {
  constructor() {
    this.preprocessingEnabled = true;
  }

  /**
   * Preprocess image for better OCR accuracy
   */
  async preprocessImage(imagePath) {
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '_processed.png');

    await sharp(imagePath)
      .grayscale()  //Convert to grayscale
      .normalize()   // Normalize contrast
      .sharpen()     // Sharpen for better text recognition
      .toFile(outputPath);

    return outputPath;
  }

  /**
   * Extract text from image using Tesseract OCR
   */
  async extractText(imagePath) {
    let processedPath = imagePath;

    // Preprocess if enabled
    if (this.preprocessingEnabled && /\.(png|jpg|jpeg)$/i.test(imagePath)) {
      try {
        processedPath = await this.preprocessImage(imagePath);
      } catch (error) {
        console.warn('Image preprocessing failed, using original:', error.message);
      }
    }

    // Run OCR
    const result = await Tesseract.recognize(processedPath, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          process.stdout.write(`\r  OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    // Clean up processed file
    if (processedPath !== imagePath) {
      try {
        await fs.unlink(processedPath);
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    process.stdout.write('\n');
    return result;
  }

  /**
   * Parse extracted text for financial patterns
   */
  parseFinancialData(text) {
    const data = {
      rawText: text,
      amounts: [],
      dates: [],
      accountNumbers: [],
      percentages: [],
      lines: []
    };

    // Split into lines
    const lines = text.split('\n').filter(line => line.trim());
    data.lines = lines;

    // Extract currency amounts
    const currencyRegex = /\$?\s?-?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;
    const currencyMatches = text.match(currencyRegex) || [];
    data.amounts = currencyMatches.map(match => {
      const cleaned = match.replace(/[\s$,]/g, '');
      const value = parseFloat(cleaned);
      return {
        text: match.trim(),
        value: isNaN(value) ? 0 : value
      };
    });

    // Extract dates (MM/DD/YYYY, Month DD, YYYY, etc.)
    const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi;
    data.dates = text.match(dateRegex) || [];

    // Extract account numbers (****1234 pattern)
    const accountRegex = /\*{4,}\d{4}/g;
    data.accountNumbers = text.match(accountRegex) || [];

    // Extract percentages
    const percentRegex = /\d+\.?\d*\s?%/g;
    data.percentages = text.match(percentRegex) || [];

    return data;
  }

  /**
   * Main read function - combines OCR and parsing
   */
  async read(imagePath) {
    console.log(`📸 Reading: ${path.basename(imagePath)}`);
    console.log('🔄 Running OCR...');

    const result = await this.extractText(imagePath);

    console.log(`✅ OCR Complete (Confidence: ${Math.round(result.data.confidence)}%)`);
    console.log('📊 Parsing financial data...');

    const parsed = this.parseFinancialData(result.data.text);

    return {
      source: imagePath,
      confidence: result.data.confidence,
      extractedDate: new Date().toISOString(),
      ...parsed
    };
  }
}

module.exports = ScreenshotReader;
