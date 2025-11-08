/**
 * Financial Command Center - Web Interface
 *
 * Drag-and-drop interface for processing financial data
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

// Import processors
const processQuicken = require('./process_quicken');
const processQuickBooks = require('./process_quickbooks');
const NotionSync = require('./outputs/notion_sync');

const app = express();
const PORT = 3001;

// Configure file upload
const upload = multer({
  dest: 'data/uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure upload directory exists
async function ensureDirectories() {
  await fs.mkdir('data/uploads', { recursive: true });
  await fs.mkdir('data/screenshots', { recursive: true });
  await fs.mkdir('data/extracted', { recursive: true });
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Process Quicken screenshot
 */
app.post('/api/process-quicken', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { date } = req.body;
    console.log(`\n📸 Processing Quicken screenshot: ${req.file.originalname}`);

    // Move file to screenshots directory
    const screenshotPath = path.join('data/screenshots', req.file.originalname);
    await fs.rename(req.file.path, screenshotPath);

    // Process with Quicken processor
    const result = await processQuicken(screenshotPath);

    console.log('✅ Quicken processing complete');
    res.json({
      success: true,
      data: result,
      message: `Processed ${result.accounts.length} accounts`
    });

  } catch (error) {
    console.error('❌ Quicken processing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Process QuickBooks PDF
 */
app.post('/api/process-quickbooks', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { startDate, endDate } = req.body;
    console.log(`\n📄 Processing QuickBooks PDF: ${req.file.originalname}`);

    // Move file to screenshots directory (we use same directory for all uploads)
    const pdfPath = path.join('data/screenshots', req.file.originalname);
    await fs.rename(req.file.path, pdfPath);

    // Process with QuickBooks processor
    const result = await processQuickBooks(pdfPath);

    console.log('✅ QuickBooks processing complete');
    res.json({
      success: true,
      data: result,
      message: `Processed P&L data`
    });

  } catch (error) {
    console.error('❌ QuickBooks processing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Sync to Notion
 */
app.post('/api/sync-notion', async (req, res) => {
  try {
    console.log('\n📤 Syncing to Notion...');

    const { date } = req.body;
    const syncer = new NotionSync();
    const result = await syncer.sync({ date });

    console.log('✅ Notion sync complete');
    res.json({
      success: true,
      data: result,
      message: `Synced ${result.successCount} accounts to Notion`
    });

  } catch (error) {
    console.error('❌ Notion sync failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get latest extracted data
 */
app.get('/api/latest-data', async (req, res) => {
  try {
    const extractedDir = 'data/extracted';
    const files = await fs.readdir(extractedDir);

    const quickenFiles = files.filter(f => f.includes('_quicken.json'));
    const quickbooksFiles = files.filter(f => f.includes('_quickbooks.json'));

    let latestQuicken = null;
    let latestQuickBooks = null;

    if (quickenFiles.length > 0) {
      const quickenStats = await Promise.all(
        quickenFiles.map(async (file) => {
          const filePath = path.join(extractedDir, file);
          const stats = await fs.stat(filePath);
          return { file, mtime: stats.mtime, path: filePath };
        })
      );
      quickenStats.sort((a, b) => b.mtime - a.mtime);
      const data = await fs.readFile(quickenStats[0].path, 'utf-8');
      latestQuicken = JSON.parse(data);
    }

    if (quickbooksFiles.length > 0) {
      const qbStats = await Promise.all(
        quickbooksFiles.map(async (file) => {
          const filePath = path.join(extractedDir, file);
          const stats = await fs.stat(filePath);
          return { file, mtime: stats.mtime, path: filePath };
        })
      );
      qbStats.sort((a, b) => b.mtime - a.mtime);
      const data = await fs.readFile(qbStats[0].path, 'utf-8');
      latestQuickBooks = JSON.parse(data);
    }

    res.json({
      success: true,
      quicken: latestQuicken,
      quickbooks: latestQuickBooks
    });

  } catch (error) {
    console.error('❌ Failed to get latest data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
async function start() {
  try {
    await ensureDirectories();

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(70));
      console.log('🚀 FINANCIAL COMMAND CENTER - WEB INTERFACE');
      console.log('='.repeat(70));
      console.log(`\n✅ Server running at: http://localhost:${PORT}`);
      console.log('\n📂 Endpoints:');
      console.log('   POST /api/process-quicken    - Upload Quicken screenshot');
      console.log('   POST /api/process-quickbooks - Upload QuickBooks PDF');
      console.log('   POST /api/sync-notion        - Sync to Notion');
      console.log('   GET  /api/latest-data        - Get latest extracted data');
      console.log('\n' + '='.repeat(70) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
