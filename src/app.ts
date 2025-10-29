import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

import connectDb from './shared/config/db';
import authRoutes from '../src/features/auth/routes/auth.routes';
import messageRoutes from './features/chat/routes/message.routes';
import { socketController } from './features/chat/controllers/socket.controller';

const app = express();
connectDb();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', socketController.handleSocketConnection(io));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
