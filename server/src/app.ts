// src/app.ts
import express from 'express';
import 'reflect-metadata';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4000', 
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); 

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;