// file: src/app.js
import 'dotenv/config';
import express from 'express';
import productsRouter from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json());

// // Routes
// app.use('/products', productsRouter);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});