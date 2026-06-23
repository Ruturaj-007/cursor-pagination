import 'dotenv/config';
import { pool } from './db/db.js';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'];
const TOTAL = 200_000;
const BATCH = 10_000;

await pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    category   VARCHAR(100) NOT NULL,
    price      NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_created_id
    ON products (created_at DESC, id DESC);
  CREATE INDEX IF NOT EXISTS idx_category_created_id
    ON products (category, created_at DESC, id DESC);
`);

const { rows: [{ count }] } = await pool.query('SELECT COUNT(*) FROM products');
if (parseInt(count) >= TOTAL) {
  console.log('Already seeded, skipping.');
  await pool.end();
  process.exit(0);
}

console.log(`Seeding ${TOTAL} products in batches of ${BATCH}...`);
const start = Date.now();

for (let i = 0; i < TOTAL / BATCH; i++) {
  const values = [];
  const params = [];
  let p = 1;

  for (let j = 0; j < BATCH; j++) {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const price = (Math.random() * 9990 + 10).toFixed(2);
    const name = `Product_${i * BATCH + j + 1}`;
    // spread created_at over last 365 days
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

    values.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
    params.push(name, cat, price, createdAt, createdAt);
  }

  await pool.query(
    `INSERT INTO products (name, category, price, created_at, updated_at) VALUES ${values.join(',')}`,
    params
  );

  console.log(`  Batch ${i + 1}/${TOTAL / BATCH} done`);
}

console.log(`Seeded ${TOTAL} products in ${((Date.now() - start) / 1000).toFixed(1)}s`);
await pool.end();