import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js'
const port = process.env.PORT || 5000;
import cors from 'cors';
import path, { dirname } from 'path'; // For file saving
import fs from 'fs';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

connectDB();
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials (cookies)
};
const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/activity', activityRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.json({message:"Physioactivity API is running"})
  });
}

//app.use(notFound);
//app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
