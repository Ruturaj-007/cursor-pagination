// file: src/routes/products.js
import { Router } from 'express';
import { pool } from '../db/db.js';
import { encodeCursor, decodeCursor } from '../utils/cursor.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const category = req.query.category || null;
    const cursor = req.query.cursor || null;

    let decoded = null;
    if (cursor) {
      decoded = decodeCursor(cursor);
      if (!decoded) return res.status(400).json({ error: 'Invalid cursor' });
    }

    const params = [];
    let p = 1;
    let where = [];

    if (category) {
      where.push(`category = $${p++}`);
      params.push(category);
    }

    if (decoded) {
      // key: use (created_at, id) tuple comparison for stable cursor pagination
      // this ensures no duplicates/skips even if rows are inserted while browsing
      where.push(`(created_at, id) < ($${p++}, $${p++})`);
      params.push(decoded.createdAt, decoded.id);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    params.push(limit + 1); // fetch one extra to check has_more

    const { rows } = await pool.query(
      `SELECT id, name, category, price, created_at, updated_at
       FROM products
       ${whereClause}
       ORDER BY created_at DESC, id DESC
       LIMIT $${p}`,
      params
    );

    const has_more = rows.length > limit;
    const data = has_more ? rows.slice(0, limit) : rows;
    const last = data[data.length - 1];
    const next_cursor = has_more ? encodeCursor(last.created_at, last.id) : null;

    res.json({ data, next_cursor, has_more, count: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/explain', async (req, res) => {
  try {
    const category = req.query.category || null;
    const cursor = req.query.cursor || null;

    let decoded = null;
    if (cursor) {
      decoded = decodeCursor(cursor);
      if (!decoded) return res.status(400).json({ error: 'Invalid cursor' });
    }

    const params = [];
    let p = 1;
    let where = [];

    if (category) {
      where.push(`category = $${p++}`);
      params.push(category);
    }
    if (decoded) {
      where.push(`(created_at, id) < ($${p++}, $${p++})`);
      params.push(decoded.createdAt, decoded.id);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    params.push(20);

    const { rows } = await pool.query(
      `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
       SELECT id, name, category, price, created_at, updated_at
       FROM products
       ${whereClause}
       ORDER BY created_at DESC, id DESC
       LIMIT $${p}`,
      params
    );

    res.json(rows[0]['QUERY PLAN']);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;