const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

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