const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Koneksi ke Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/crm/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'crm-service', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', service: 'crm-service', db: 'disconnected', error: err.message });
  }
});

// ─── Customers (User dengan role CUSTOMER) ──────────────────────────────────
app.get('/api/crm/customers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, "createdAt"
       FROM "User"
       WHERE role = 'CUSTOMER'
       ORDER BY "createdAt" DESC`
    );
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Leads ──────────────────────────────────────────────────────────────────
app.get('/api/crm/leads', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, m.name AS "motorcycleName"
       FROM "Lead" l
       LEFT JOIN "Motorcycle" m ON l."motorcycleId" = m.id
       ORDER BY l."createdAt" DESC`
    );
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/crm/leads', async (req, res) => {
  const { customerName, customerEmail, customerPhone, notes, motorcycleId } = req.body;
  if (!customerName) {
    return res.status(400).json({ success: false, error: 'customerName is required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO "Lead" (id, "customerName", "customerEmail", "customerPhone", notes, "motorcycleId", status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'NEW', NOW(), NOW())
       RETURNING *`,
      [customerName, customerEmail || null, customerPhone || null, notes || null, motorcycleId || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/crm/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes, followUpDate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "Lead"
       SET status = COALESCE($1, status),
           notes  = COALESCE($2, notes),
           "followUpDate" = COALESCE($3, "followUpDate"),
           "updatedAt" = NOW()
       WHERE id = $4
       RETURNING *`,
      [status || null, notes || null, followUpDate || null, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Stats ringkas untuk dashboard ──────────────────────────────────────────
app.get('/api/crm/stats', async (req, res) => {
  try {
    const [customers, leads, hot] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role = 'CUSTOMER'`),
      pool.query(`SELECT COUNT(*) FROM "Lead"`),
      pool.query(`SELECT COUNT(*) FROM "Lead" WHERE status = 'HOT'`),
    ]);
    res.json({
      success: true,
      data: {
        totalCustomers: parseInt(customers.rows[0].count),
        totalLeads: parseInt(leads.rows[0].count),
        hotLeads: parseInt(hot.rows[0].count),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`CRM Service running on port ${port}`);
});
