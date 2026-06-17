const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const db = new Database('waitlist.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(bodyParser.json());

const synthesisEngine = require('./src/engine/synthesis');
const pdfEngine = require('./src/engine/pdfEngine');

// API Routes
app.post('/api/generate', (req, res) => {
  const { name, birthDate, birthTime } = req.body;
  if (!name || !birthDate || !birthTime) {
    return res.status(400).json({ error: 'Name, birthDate, and birthTime are required' });
  }

  try {
    const reading = synthesisEngine.generateReading(name, birthDate, birthTime);
    res.json(reading);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate reading' });
  }
});

app.post('/api/pdf', async (req, res) => {
  const { name, birthDate, birthTime } = req.body;
  if (!name || !birthDate || !birthTime) {
    return res.status(400).json({ error: 'Name, birthDate, and birthTime are required' });
  }

  try {
    const reading = synthesisEngine.generateReading(name, birthDate, birthTime);
    const pdfBuffer = await pdfEngine.generatePDF(reading);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Syntropy_Reading_${name.replace(/\s+/g, '_')}.pdf`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.post('/api/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO waitlist (email) VALUES (?)');
    stmt.run(email);
    res.status(201).json({ message: 'Added to waitlist' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already on waitlist' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
