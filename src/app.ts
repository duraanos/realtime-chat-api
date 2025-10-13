const express = require('express');
const dotenv = require('dotenv');
import connectDb from './config/db';

dotenv.config();

const app = express();
connectDb();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/health', (req: any, res: any) => {
  res.status(200).json({
    status: 'OK',
    message: 'Realtime Chat API is running!',
    timeStamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
