import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import connectDb from './shared/config/db';
import authRoutes from '../src/features/auth/routes/auth.routes';
import userRoutes from '../src/features/user/routes/user.routes';

const app = express();
connectDb();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
