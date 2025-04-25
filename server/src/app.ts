// src/app.ts
import express from 'express';
import 'reflect-metadata';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL!, 
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/badges", express.static(path.join(__dirname, "../public/badges")))

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); 

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;