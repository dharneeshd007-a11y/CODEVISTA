import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import csvParser from 'csv-parser';
import { initDb } from './db.js';
import * as ai from './ai.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let db;
initDb().then((database) => {
  db = database;
  console.log('Database initialized');
});

// Helper to extract text
async function extractText(filePath, mimeType) {
  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimeType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf-8');
    } else if (mimeType === 'text/csv') {
      return new Promise((resolve, reject) => {
        let results = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(JSON.stringify(data)))
          .on('end', () => resolve(results.join('\n')))
          .on('error', reject);
      });
    }
    return null;
  } catch (error) {
    console.error('Extraction error:', error);
    return null;
  }
}

// 1. Get all documents
app.get('/api/documents', async (req, res) => {
  const docs = await db.all('SELECT id, name, type, status, lastUpdated, summary, isDemo FROM documents ORDER BY lastUpdated DESC');
  res.json(docs);
});

// 2. Upload document
app.post('/api/documents', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await extractText(file.path, file.mimetype);
    fs.unlinkSync(file.path); // cleanup

    if (!text) {
      return res.status(400).json({ error: 'Unsupported file type or extraction failed' });
    }

    const id = crypto.randomUUID();
    const type = path.extname(file.originalname).substring(1).toUpperCase() || 'UNKNOWN';
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    await db.run(
      'INSERT INTO documents (id, name, type, status, lastUpdated, content, isDemo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, file.originalname, type, 'Processed', now, text, 0]
    );

    const doc = await db.get('SELECT id, name, type, status, lastUpdated, summary, isDemo FROM documents WHERE id = ?', [id]);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get document details
app.get('/api/documents/:id', async (req, res) => {
  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// 4. Delete document
app.delete('/api/documents/:id', async (req, res) => {
  await db.run('DELETE FROM documents WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// 5. Generate Summary
app.post('/api/documents/:id/summarize', async (req, res) => {
  if (!ai.isAiConfigured()) return res.status(503).json({ error: 'AI not configured' });

  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  try {
    const summary = await ai.summarizeText(doc.content);
    await db.run('UPDATE documents SET summary = ? WHERE id = ?', [summary, req.params.id]);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// 6. Search / Ask
app.post('/api/search', async (req, res) => {
  if (!ai.isAiConfigured()) return res.status(503).json({ error: 'AI not configured' });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const docs = await db.all('SELECT name, content FROM documents');
  const context = docs.map(d => `--- ${d.name} ---\n${d.content}`).join('\n\n');

  try {
    const answer = await ai.askQuestion(query, context);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// 7. Compare
app.post('/api/compare', async (req, res) => {
  if (!ai.isAiConfigured()) return res.status(503).json({ error: 'AI not configured' });

  const { doc1Id, doc2Id } = req.body;
  const doc1 = await db.get('SELECT name, content FROM documents WHERE id = ?', [doc1Id]);
  const doc2 = await db.get('SELECT name, content FROM documents WHERE id = ?', [doc2Id]);

  if (!doc1 || !doc2) return res.status(404).json({ error: 'Document not found' });

  try {
    const comparison = await ai.compareDocuments(doc1, doc2);
    res.json({ comparison });
  } catch (error) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

// 8. Conflicts API
app.get('/api/conflicts', async (req, res) => {
  const conflicts = await db.all('SELECT * FROM conflicts');
  // parse JSON strings for sourceA and sourceB if needed, but we can store them as strings
  res.json(conflicts.map(c => ({
    ...c,
    sourceA: c.sourceA ? JSON.parse(c.sourceA) : null,
    sourceB: c.sourceB ? JSON.parse(c.sourceB) : null,
    actionCreated: !!c.actionCreated
  })));
});

app.post('/api/conflicts', async (req, res) => {
  const id = crypto.randomUUID();
  const c = req.body;
  await db.run(
    'INSERT INTO conflicts (id, title, status, priority, description, sourceA, sourceB, differenceHighlight, whyItMatters, recommendedAction, actionCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, c.title, c.status, c.priority, c.description, JSON.stringify(c.sourceA), JSON.stringify(c.sourceB), c.differenceHighlight, c.whyItMatters, c.recommendedAction, c.actionCreated ? 1 : 0]
  );
  res.json({ id, ...c });
});

app.put('/api/conflicts/:id', async (req, res) => {
  const c = req.body;
  await db.run('UPDATE conflicts SET status = ?, actionCreated = ? WHERE id = ?', [c.status, c.actionCreated ? 1 : 0, req.params.id]);
  res.json({ success: true });
});

// 9. Actions API
app.get('/api/actions', async (req, res) => {
  const actions = await db.all('SELECT * FROM actions ORDER BY createdAt DESC');
  res.json(actions);
});

app.post('/api/actions', async (req, res) => {
  const id = crypto.randomUUID();
  const a = req.body;
  await db.run(
    'INSERT INTO actions (id, title, source, reason, priority, status, due, why, relatedConflict, relatedConflictId, recommendedNextStep, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, a.title, a.source, a.reason, a.priority, a.status, a.due, a.why, a.relatedConflict, a.relatedConflictId, a.recommendedNextStep, a.createdAt]
  );
  res.json({ id, ...a });
});

app.put('/api/actions/:id', async (req, res) => {
  const a = req.body;
  await db.run('UPDATE actions SET status = ? WHERE id = ?', [a.status, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/actions/:id', async (req, res) => {
  await db.run('DELETE FROM actions WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// Check AI status
app.get('/api/status', (req, res) => {
  res.json({ aiConfigured: ai.isAiConfigured() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
