require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

let db;
async function connectDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'infopilot_ai'
  });
  console.log('Database connected');
}
connectDB().catch(console.error);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// === AUTH ROUTES ===
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ user: { id: userId, name, email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.username, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// === DOCUMENT ROUTES ===
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/documents', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.file;
    const id = uuidv4();
    const name = file.originalname;
    const type = file.originalname.split('.').pop().toUpperCase();
    const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    const status = 'Processed';
    const lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const user_id = req.user.id;

    // Check duplicate
    const [existing] = await db.query('SELECT * FROM documents WHERE user_id = ? AND name = ? AND size = ?', [user_id, name, size]);
    let duplicate_status = 0;
    let duplicate_of = null;
    
    if (existing.length > 0) {
      duplicate_status = 1;
      duplicate_of = existing[0].id;
    }

    let extractedText = null;
    if (type === 'PDF') {
      try {
        const dataBuffer = fs.readFileSync(file.path);
        const data = await pdfParse(dataBuffer);
        if (data && data.text) {
          extractedText = data.text.trim();
        }
      } catch (err) {
        console.error('PDF Extraction Error:', err);
      }
    }

    await db.query(
      'INSERT INTO documents (id, user_id, name, type, size, status, lastUpdated, duplicate_status, duplicate_of, extracted_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user_id, name, type, size, status, lastUpdated, duplicate_status, duplicate_of, extractedText]
    );

    const [newDoc] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
    res.status(201).json(newDoc[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.delete('/api/documents/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [doc] = await db.query('SELECT * FROM documents WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    if (doc.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    await db.query('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.get('/api/documents/search', authenticateToken, async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) return res.json([]);
    const searchTerm = `%${query}%`;
    const [rows] = await db.query(
      'SELECT id, name, type, size, status, lastUpdated, summary, extracted_text FROM documents WHERE user_id = ? AND (name LIKE ? OR summary LIKE ? OR extracted_text LIKE ?)', 
      [req.user.id, searchTerm, searchTerm, searchTerm]
    );

    const results = rows.map(doc => {
      let snippet = null;
      if (doc.extracted_text) {
        const textLower = doc.extracted_text.toLowerCase();
        const queryLower = query.toLowerCase();
        const index = textLower.indexOf(queryLower);
        if (index !== -1) {
          const start = Math.max(0, index - 60);
          const end = Math.min(doc.extracted_text.length, index + query.length + 60);
          snippet = (start > 0 ? '...' : '') + doc.extracted_text.substring(start, end).replace(/\n/g, ' ') + (end < doc.extracted_text.length ? '...' : '');
        } else {
           snippet = doc.extracted_text.substring(0, 150).replace(/\n/g, ' ') + '...';
        }
      }

      return {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        status: doc.status,
        lastUpdated: doc.lastUpdated,
        summary: doc.summary,
        snippet: snippet
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/documents/compare', authenticateToken, async (req, res) => {
  try {
    const { id1, id2 } = req.query;
    if (!id1 || !id2) return res.status(400).json({ error: 'Missing document IDs' });

    const [docs] = await db.query(
      'SELECT * FROM documents WHERE id IN (?, ?) AND user_id = ?',
      [id1, id2, req.user.id]
    );

    if (docs.length !== 2) {
      return res.status(404).json({ error: 'One or both documents not found' });
    }

    const doc1 = docs.find(d => d.id === id1);
    const doc2 = docs.find(d => d.id === id2);

    // Extract fields from text
    const items1 = [];
    const items2 = [];
    const extractField = (text, fieldRegex, fallback) => {
      if (!text) return fallback;
      const match = text.match(fieldRegex);
      return match ? match[1].trim() : fallback;
    };

    const t1 = doc1.extracted_text || '';
    const t2 = doc2.extracted_text || '';

    const fields = [
      { label: 'Start Date', regex: /start date[^\d\w]*(\d{1,2}\s+[a-z]+\s+\d{4})/i },
      { label: 'Submission Deadline', regex: /submission\s*deadline[^\d\w]*(\d{1,2}\s+[a-z]+\s+\d{4})/i },
      { label: 'Budget', regex: /budget[^\d\w]*(Rs\.?\s*\d+,\d+|\₹?\s*\d+,\d+|\d+)/i },
      { label: 'Team Size', regex: /team size[^\d\w]*(\d+\s*[a-z]*)/i },
      { label: 'Requirements', regex: /requirements[^\d\w]*([\w\s,]+)/i }
    ];

    for (const f of fields) {
      const v1 = extractField(t1, f.regex, 'Not extracted');
      const v2 = extractField(t2, f.regex, 'Not extracted');
      const diff = v1 !== v2 && v1 !== 'Not extracted' && v2 !== 'Not extracted';
      
      items1.push({ label: f.label, value: v1, diff });
      items2.push({ label: f.label, value: v2, diff });
    }

    res.json({
      doc1: { id: doc1.id, name: doc1.name, items: items1 },
      doc2: { id: doc2.id, name: doc2.name, items: items2 },
      conflictCount: items1.filter(i => i.diff).length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

// === INSIGHTS ROUTES ===
app.get('/api/documents/:id/insights', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [docs] = await db.query('SELECT * FROM documents WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (docs.length === 0) return res.status(404).json({ error: 'Document not found' });
    
    const doc = docs[0];
    
    // Construct simulated prototype insights if real data doesn't exist yet
    const insights = {
      summary: doc.summary || "Prototype Insight — Simulated Processing: Document metadata processed. Full text extraction pending.",
      important_dates: doc.important_dates || [{ label: "Upload Date", value: doc.lastUpdated }],
      requirements: doc.requirements || [],
      action_items: doc.action_items || [],
      important_details: doc.important_details || [{ label: "File Type", value: doc.type }, { label: "Size", value: doc.size }]
    };
    
    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// === CONFLICTS ROUTES ===
app.get('/api/conflicts', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conflicts WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// === ACTIONS ROUTES ===
app.get('/api/actions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM actions WHERE user_id = ? ORDER BY db_created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/actions', authenticateToken, async (req, res) => {
  try {
    const id = uuidv4();
    const { title, source, reason, priority, status, due, why, relatedConflict, relatedConflictId, recommendedNextStep } = req.body;
    
    await db.query(
      `INSERT INTO actions (id, user_id, title, source, reason, priority, status, due, why, relatedConflict, relatedConflictId, recommendedNextStep, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, source, reason, priority, status || 'pending', due, why, relatedConflict, relatedConflictId, recommendedNextStep, new Date().toISOString()]
    );
    
    const [newAction] = await db.query('SELECT * FROM actions WHERE id = ?', [id]);
    res.status(201).json(newAction[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create action' });
  }
});

app.put('/api/actions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // only status update for now
    
    const [actions] = await db.query('SELECT * FROM actions WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (actions.length === 0) return res.status(404).json({ error: 'Action not found' });
    
    await db.query('UPDATE actions SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update action' });
  }
});

app.delete('/api/actions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [actions] = await db.query('SELECT * FROM actions WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (actions.length === 0) return res.status(404).json({ error: 'Action not found' });
    
    await db.query('DELETE FROM actions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete action' });
  }
});

// === DASHBOARD ROUTES ===
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [[docsCount]] = await db.query('SELECT COUNT(*) as count FROM documents WHERE user_id = ?', [req.user.id]);
    const [[processedCount]] = await db.query('SELECT COUNT(*) as count FROM documents WHERE user_id = ? AND status = ?', [req.user.id, 'Processed']);
    const [[duplicatesCount]] = await db.query('SELECT COUNT(*) as count FROM documents WHERE user_id = ? AND duplicate_status = 1', [req.user.id]);
    const [[conflictsCount]] = await db.query('SELECT COUNT(*) as count FROM conflicts WHERE user_id = ? AND status = ?', [req.user.id, 'Active']);
    const [[actionsCount]] = await db.query('SELECT COUNT(*) as count FROM actions WHERE user_id = ? AND status = ?', [req.user.id, 'pending']);
    
    res.json({
      totalDocuments: docsCount.count,
      processedDocuments: processedCount.count,
      duplicateRecords: duplicatesCount.count,
      activeConflicts: conflictsCount.count,
      pendingActions: actionsCount.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
