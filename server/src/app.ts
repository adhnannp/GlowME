// src/app.ts
import express from 'express';
import 'reflect-metadata';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', userRoutes);
app.use('/api', adminRoutes); 

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;