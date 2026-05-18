const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// Koneksi ke Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/hr/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'hr-service', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', service: 'hr-service', db: 'disconnected', error: err.message });
  }
});

// ─── Employees (User dengan role SALES_REP atau ADMIN) ───────────────────────
app.get('/api/hr/employees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, "createdAt"
       FROM "User"
       WHERE role IN ('SALES_REP', 'ADMIN')
       ORDER BY role, name ASC`
    );
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/hr/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const empResult = await pool.query(
      `SELECT id, email, name, role, "createdAt"
       FROM "User" WHERE id = $1`,
      [id]
    );
    if (empResult.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Ambil ringkasan performa: jumlah leads yang di-handle
    const leadsResult = await pool.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'CONVERTED') AS converted,
              COUNT(*) FILTER (WHERE status = 'HOT') AS hot
       FROM "Lead" WHERE "assignedToId" = $1`,
      [id]
    );

    // Ambil jumlah order yang berhasil
    const ordersResult = await pool.query(
      `SELECT COUNT(*) AS total_orders,
              COALESCE(SUM("totalPrice"), 0) AS total_revenue
       FROM "SaleOrder" WHERE "userId" = $1 AND status = 'COMPLETED'`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...empResult.rows[0],
        performance: {
          ...leadsResult.rows[0],
          ...ordersResult.rows[0],
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Performance summary semua sales rep ─────────────────────────────────────
app.get('/api/hr/performance', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.role,
         COUNT(l.id)                                           AS total_leads,
         COUNT(l.id) FILTER (WHERE l.status = 'CONVERTED')    AS converted_leads,
         COUNT(so.id)                                          AS total_orders,
         COALESCE(SUM(so."totalPrice") FILTER (WHERE so.status = 'COMPLETED'), 0) AS total_revenue
       FROM "User" u
       LEFT JOIN "Lead"      l  ON l."assignedToId" = u.id
       LEFT JOIN "SaleOrder" so ON so."userId"      = u.id
       WHERE u.role IN ('SALES_REP', 'ADMIN')
       GROUP BY u.id, u.name, u.email, u.role
       ORDER BY total_revenue DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Stats ringkas untuk dashboard ──────────────────────────────────────────
app.get('/api/hr/stats', async (req, res) => {
  try {
    const [employees, salesReps, admins] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role IN ('SALES_REP', 'ADMIN')`),
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role = 'SALES_REP'`),
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role = 'ADMIN'`),
    ]);
    res.json({
      success: true,
      data: {
        totalEmployees: parseInt(employees.rows[0].count),
        salesReps: parseInt(salesReps.rows[0].count),
        admins: parseInt(admins.rows[0].count),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`HR Service running on port ${port}`);
});
