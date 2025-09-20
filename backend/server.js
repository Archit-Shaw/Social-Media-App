import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import connectDB from './config/db.js';
import { app, server } from './socket/socket.js'; // Nayi file se import

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import generationRoutes from './routes/generationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
connectDB();

/*
  IMPORTANT:
  - Add your Vercel frontend origin below.
  - Keep backend origin only if you need it for server-to-server calls.
*/
const whitelist = [
  'http://localhost:5173',
  'https://social-media-app-3reb.onrender.com',      // backend origin (if needed)
  'https://social-media-app-k3t8.vercel.app'         // <-- add your Vercel frontend origin
];

// If you want to configure via env, you can use process.env.ALLOWED_ORIGINS split by comma.

const corsOptions = {
  origin: function(origin, callback) {
    // Allow non-browser requests (e.g. curl, Postman) which have no origin
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true, // set true only if you actually use cookies or authentication via cookies
};

// apply CORS middleware BEFORE routes
app.use(cors(corsOptions));

// explicitly respond to preflight OPTIONS for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes (note: your routes are mounted under /api)
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/generate', generationRoutes);
app.use('/api/messages', messageRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running successfully.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
