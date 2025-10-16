import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import connectDb from './shared/config/db';
import authRoutes from '../src/features/auth/routes/auth.routes';

const app = express();
connectDb();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
