# Cursor Pagination API

A high-performance REST API built with Express.js, PostgreSQL, and Drizzle ORM that demonstrates **Cursor-Based Pagination**, **Category Filtering**, and **Database Index Optimization** for large datasets.

---

## Features

- Cursor-based pagination
- Category filtering
- PostgreSQL composite indexes
- Stable pagination using `(created_at, id)`
- EXPLAIN ANALYZE endpoint
- Seed script for generating large datasets
- Express.js REST API
- Drizzle ORM integration

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- Drizzle Kit

---

## Project Structure

```text
cursor-pagination/
│
├── assets/
├── drizzle/
├── src/
│   ├── db/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── seed.js
│
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd cursor-pagination
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=3000
```

### Run Server

```bash
npm run dev
```

Server starts at:

```text
http://localhost:3000
```

---

## Health Check

### Request

```http
GET /health
```

### Response

```json
{
  "status": "ok"
}
```

---

# Database Indexes

The project uses two composite indexes:

### Feed Optimization

```sql
(created_at DESC, id DESC)
```

Used when fetching newest products.

### Category Feed Optimization

```sql
(category, created_at DESC, id DESC)
```

Used when filtering products by category.

---

# Cursor Pagination

Instead of OFFSET pagination, this project uses cursor pagination.

Benefits:

- Faster on large datasets
- No duplicate records
- No skipped records
- Stable ordering

Cursor contains:

```json
{
  "createdAt": "...",
  "id": "..."
}
```

Encoded as Base64 before sending to the client.

---

# API Endpoints

## Get Products

### Request

```http
GET /products
```

Returns newest products first.

### Example

```http
GET /products?limit=20
```

---

## Filter By Category

### Request

```http
GET /products?category=Electronics
```

Returns only Electronics products.

---

## Next Page Using Cursor

### Request

```http
GET /products?cursor=<next_cursor>
```

Fetches the next set of products.

---

## Category + Cursor Pagination

### Request

```http
GET /products?category=Electronics&cursor=<next_cursor>
```

Combines filtering and cursor pagination.

---

## Query Execution Plan

### Request

```http
GET /products/explain
```

### Category Example

```http
GET /products/explain?category=Electronics
```

Used to verify PostgreSQL index usage.

Look for:

```text
Index Scan
```

or

```text
Index Only Scan
```

---

# Screenshots

## Get Products

![Get Products](assets/get_products.png)

---

## Select Products Query

![Select Query](assets/select_star_from_products.png)

---

## Limited Results

![Limited Results](assets/select_star_from_products_limit_11.png)

---

## Fetch Products From Database

![Database Query](assets/fetch_5_products_from_db.png)

---

## Min & Max Analysis

![Min Max](assets/min_max.png)

---

## Descending Order Index

![Created At Desc](assets/created_at_desc.png)

---

## Electronics Pagination

![Electronics Pagination](assets/nextPageOfElectronicsProductsUsingTheCursorFromThePreviousElectronicsQuery.png)

---

# Sample Workflow

### First Request

```http
GET /products?category=Electronics
```

Returns:

```json
{
  "next_cursor": "..."
}
```

### Second Request

```http
GET /products?category=Electronics&cursor=...
```

Returns next Electronics products.

This demonstrates:

- Category filtering
- Cursor pagination
- Stable ordering
- Efficient querying

---

# Interview Explanation

This project demonstrates how cursor-based pagination can be implemented using a composite `(created_at, id)` key. Composite descending indexes allow PostgreSQL to fetch pre-sorted records directly from the index, eliminating expensive sorting operations and improving performance for large datasets.

---

# Run Seed Script

Generate sample data:

```bash
npm run seed
```

---

# Author

Ruturaj Pawar

Built as a backend performance optimization project demonstrating:

- PostgreSQL Indexing
- Cursor Pagination
- Query Optimization
- REST API Design